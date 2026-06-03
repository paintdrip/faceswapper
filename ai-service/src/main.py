import os
import sys
import io
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager

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

@app.post("/swap")
async def swap_faces(
    source: UploadFile = File(...),
    target_face: UploadFile = File(...),
):
    if not service:
        raise HTTPException(status_code=500, detail="Service not initialized")

    if not source.content_type or not source.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid source file type")

    if not target_face.content_type or not target_face.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid target face file type")

    try:
        source_contents = await source.read()
        if len(source_contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Source file too large (max 10MB)")

        target_contents = await target_face.read()
        if len(target_contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Target face file too large (max 10MB)")

        source_nparr = np.frombuffer(source_contents, np.uint8)
        source_img = cv2.imdecode(source_nparr, cv2.IMREAD_COLOR)
        if source_img is None:
            raise HTTPException(status_code=400, detail="Invalid source image")

        target_nparr = np.frombuffer(target_contents, np.uint8)
        target_img = cv2.imdecode(target_nparr, cv2.IMREAD_COLOR)
        if target_img is None:
            raise HTTPException(status_code=400, detail="Invalid target face image")

        result, faces_detected = service.swap_faces(source_img, target_img)

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

@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
