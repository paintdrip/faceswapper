import os
import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis
from insightface.data import get_image as ins_get_image

class FaceSwapService:
    def __init__(self, face_path: str, models_dir: str):
        self.face_path = face_path
        self.models_dir = models_dir
        self.app = None
        self.swapper = None
        self.reference_face = None
        self._init_models()

    def _init_models(self):
        print("Loading face analysis models...")
        self.app = FaceAnalysis(
            name='buffalo_l',
            root=self.models_dir,
            providers=['CPUExecutionProvider'],
        )
        self.app.prepare(ctx_id=0, det_size=(640, 640))
        print("Face analysis models loaded")

        swapper_path = os.path.join(self.models_dir, 'inswapper_128.onnx')
        if not os.path.exists(swapper_path):
            print(f"Downloading inswapper_128.onnx to {swapper_path}...")
            self._download_model(swapper_path)

        print("Loading face swapper model...")
        self.swapper = insightface.model_zoo.get_model(swapper_path)
        print("Face swapper model loaded")

        self._prepare_reference_face()

    def _download_model(self, dest_path: str):
        import urllib.request
        url = "https://github.com/deepinsight/insightface/releases/download/v0.7/inswapper_128.onnx"
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        urllib.request.urlretrieve(url, dest_path)
        print(f"Model downloaded to {dest_path}")

    def _prepare_reference_face(self):
        if not os.path.exists(self.face_path):
            raise FileNotFoundError(f"Reference face not found at {self.face_path}")

        print(f"Loading reference face from {self.face_path}")
        ref_img = cv2.imread(self.face_path)
        if ref_img is None:
            raise ValueError(f"Cannot read reference face image: {self.face_path}")

        ref_faces = self.app.get(ref_img)
        if len(ref_faces) == 0:
            raise ValueError("No face detected in reference image (face.png)")

        self.reference_face = ref_faces[0]
        print(f"Reference face prepared. Detected {len(ref_faces)} face(s) in reference.")

    def swap_faces(self, image: np.ndarray) -> tuple[np.ndarray, int]:
        if self.swapper is None or self.reference_face is None:
            raise RuntimeError("Models not initialized")

        faces = self.app.get(image)
        faces_detected = len(faces)

        if faces_detected == 0:
            print("No faces detected in target image")
            return image, 0

        result = image.copy()
        for face in faces:
            result = self.swapper.get(result, face, self.reference_face, paste_back=True)

        print(f"Processed {faces_detected} face(s)")
        return result, faces_detected
