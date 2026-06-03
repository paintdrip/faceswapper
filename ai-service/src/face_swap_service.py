import os
import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis


class FaceSwapService:
    def __init__(self, models_dir: str):
        self.models_dir = models_dir
        self.app = None
        self.swapper = None
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

    def _download_model(self, dest_path: str):
        import urllib.request
        url = "https://github.com/deepinsight/insightface/releases/download/v0.7/inswapper_128.onnx"
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        urllib.request.urlretrieve(url, dest_path)
        print(f"Model downloaded to {dest_path}")

    def _prepare_reference_face(self, face_image: np.ndarray):
        ref_faces = self.app.get(face_image)
        if len(ref_faces) == 0:
            raise ValueError("No face detected in target face image")

        print(f"Reference face prepared. Detected {len(ref_faces)} face(s) in reference.")
        return ref_faces[0]

    def swap_faces(self, source_image: np.ndarray, target_face_image: np.ndarray) -> tuple[np.ndarray, int]:
        if self.swapper is None:
            raise RuntimeError("Models not initialized")

        reference_face = self._prepare_reference_face(target_face_image)

        faces = self.app.get(source_image)
        faces_detected = len(faces)

        if faces_detected == 0:
            print("No faces detected in source image")
            return source_image, 0

        result = source_image.copy()
        for face in faces:
            result = self.swapper.get(result, face, reference_face, paste_back=True)

        print(f"Processed {faces_detected} face(s)")
        return result, faces_detected
