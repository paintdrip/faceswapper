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

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
FACE_PATH = os.path.join(PROJECT_ROOT, 'face.png')
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

service: FaceSwapService | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global service
    os.makedirs(MODELS_DIR, exist_ok=True)
    service = FaceSwapService(
        face_path=FACE_PATH,
        models_dir=MODELS_DIR,
    )
    print("AI Service initialized successfully")
    yield
    print("AI Service shutting down")

app = FastAPI(title="DiminSwap AI Service", lifespan=lifespan)

@app.post("/swap")
async def swap_faces(image: UploadFile = File(...)):
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

        result, faces_detected = service.swap_faces(img)

        _, buffer = cv2.imencode('.png', result)
        io_buffer = io.BytesIO(buffer.tobytes())

        return StreamingResponse(
            io_buffer,
            media_type="image/png",
            headers={"X-Faces-Detected": str(faces_detected)},
        )
    except Exception as e:
        print(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
