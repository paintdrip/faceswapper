import os
import sys
import io
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import StreamingResponse, JSONResponse
from contextlib import asynccontextmanager
from typing import List

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from face_swap_service import FaceSwapService

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

service: FaceSwapService | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global service
    os.makedirs(MODELS_DIR, exist_ok=True)
    service = FaceSwapService(models_dir=MODELS_DIR)
    print("AI Service initialized successfully")
    yield
    print("AI Service shutting down")

app = FastAPI(title="faceswapper AI Service", lifespan=lifespan)


@app.post("/detect")
async def detect_faces(image: UploadFile = File(...)):
    if not service:
        raise HTTPException(status_code=500, detail="Service not initialized")
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    contents = await image.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    try:
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image")

        faces = service.detect_faces(img)
        return JSONResponse({"faces": faces, "count": len(faces)})
    except HTTPException:
        raise
    except Exception as e:
        print(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/swap")
async def swap_faces(
    source: UploadFile = File(...),
    target_face: UploadFile = File(None),
    target_faces: List[UploadFile] = File(None),
):
    if not service:
        raise HTTPException(status_code=500, detail="Service not initialized")

    if not source.content_type or not source.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid source file type")

    try:
        source_contents = await source.read()
        if len(source_contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Source file too large (max 10MB)")

        source_nparr = np.frombuffer(source_contents, np.uint8)
        source_img = cv2.imdecode(source_nparr, cv2.IMREAD_COLOR)
        if source_img is None:
            raise HTTPException(status_code=400, detail="Invalid source image")

        # Multiple target faces mode
        if target_faces and len(target_faces) > 0:
            target_imgs = []
            for tf in target_faces:
                if tf is None:
                    target_imgs.append(None)
                    continue
                tf_contents = await tf.read()
                tf_nparr = np.frombuffer(tf_contents, np.uint8)
                tf_img = cv2.imdecode(tf_nparr, cv2.IMREAD_COLOR)
                target_imgs.append(tf_img)
            result, faces_detected = service.swap_faces_multiple(source_img, target_imgs)
        # Single target face mode (backward compatible)
        elif target_face and target_face.content_type and target_face.content_type.startswith("image/"):
            target_contents = await target_face.read()
            if len(target_contents) > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="Target face file too large (max 10MB)")
            target_nparr = np.frombuffer(target_contents, np.uint8)
            target_img = cv2.imdecode(target_nparr, cv2.IMREAD_COLOR)
            if target_img is None:
                raise HTTPException(status_code=400, detail="Invalid target face image")
            result, faces_detected = service.swap_faces(source_img, target_img)
        else:
            raise HTTPException(status_code=400, detail="Provide either target_face or target_faces")

        _, buffer = cv2.imencode('.png', result)
        io_buffer = io.BytesIO(buffer.tobytes())

        return StreamingResponse(
            io_buffer,
            media_type="image/png",
            headers={"X-Faces-Detected": str(faces_detected)},
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/swap-video")
async def swap_video(
    source: UploadFile = File(...),
    target_face: UploadFile = File(...),
):
    if not service:
        raise HTTPException(status_code=500, detail="Service not initialized")

    allowed_video = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'application/octet-stream']
    allowed_ext = ['.mp4', '.mov', '.avi', '.webm']
    filename = source.filename or ''
    has_valid_ext = any(filename.lower().endswith(ext) for ext in allowed_ext)
    if source.content_type not in allowed_video and not has_valid_ext:
        raise HTTPException(status_code=400, detail=f"Invalid video type: {source.content_type}. Allowed: MP4, MOV, AVI, WEBM")

    if not target_face.content_type or not target_face.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid target face type")

    try:
        video_contents = await source.read()
        # Limit 50MB
        if len(video_contents) > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Video too large (max 50MB)")

        target_contents = await target_face.read()
        if len(target_contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Target face too large (max 10MB)")

        target_nparr = np.frombuffer(target_contents, np.uint8)
        target_img = cv2.imdecode(target_nparr, cv2.IMREAD_COLOR)
        if target_img is None:
            raise HTTPException(status_code=400, detail="Invalid target face image")

        result_bytes, total_frames, swapped_frames = service.swap_video(video_contents, target_img)

        return StreamingResponse(
            io.BytesIO(result_bytes),
            media_type="video/mp4",
            headers={
                "X-Total-Frames": str(total_frames),
                "X-Swapped-Frames": str(swapped_frames),
                "Content-Disposition": f'attachment; filename="faceswapper-video-{source.filename or "result"}.mp4"',
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Video processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
