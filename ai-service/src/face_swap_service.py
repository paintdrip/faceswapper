import os
import io
import base64
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

    def detect_faces(self, image: np.ndarray) -> list[dict]:
        """Detect faces and return list with bbox and cropped base64 images."""
        faces = self.app.get(image)
        results = []
        for idx, face in enumerate(faces):
            bbox = face.bbox.astype(int)
            x1, y1, x2, y2 = max(0, bbox[0]), max(0, bbox[1]), min(image.shape[1], bbox[2]), min(image.shape[0], bbox[3])
            cropped = image[y1:y2, x1:x2]
            if cropped.size == 0:
                continue
            _, buffer = cv2.imencode('.png', cropped)
            b64 = base64.b64encode(buffer.tobytes()).decode('utf-8')
            results.append({
                'id': idx,
                'bbox': [int(x1), int(y1), int(x2), int(y2)],
                'cropped': f'data:image/png;base64,{b64}',
            })
        return results

    def _prepare_reference_face(self, face_image: np.ndarray):
        ref_faces = self.app.get(face_image)
        if len(ref_faces) == 0:
            raise ValueError("No face detected in target face image")
        return ref_faces[0]

    def swap_faces(self, source_image: np.ndarray, target_face_image: np.ndarray) -> tuple[np.ndarray, int]:
        """Swap all faces in source with a single target face."""
        if self.swapper is None:
            raise RuntimeError("Models not initialized")

        reference_face = self._prepare_reference_face(target_face_image)
        faces = self.app.get(source_image)
        faces_detected = len(faces)

        if faces_detected == 0:
            return source_image, 0

        result = source_image.copy()
        for face in faces:
            result = self.swapper.get(result, face, reference_face, paste_back=True)

        return result, faces_detected

    def swap_faces_multiple(self, source_image: np.ndarray, target_faces: list[np.ndarray | None]) -> tuple[np.ndarray, int]:
        """Swap each detected face in source with corresponding target face."""
        if self.swapper is None:
            raise RuntimeError("Models not initialized")

        faces = self.app.get(source_image)
        faces_detected = len(faces)

        if faces_detected == 0:
            return source_image, 0

        if len(target_faces) < faces_detected:
            raise ValueError(f"Not enough target faces. Detected {faces_detected}, got {len(target_faces)}")

        swapped_count = 0
        result = source_image.copy()
        for face, target in zip(faces, target_faces):
            if target is None or target.size == 0:
                continue
            try:
                reference_face = self._prepare_reference_face(target)
                result = self.swapper.get(result, face, reference_face, paste_back=True)
                swapped_count += 1
            except Exception as e:
                print(f"Skipping face swap for one face: {e}")
                continue

        return result, swapped_count

    def swap_video(self, video_bytes: bytes, target_face_image: np.ndarray) -> tuple[bytes, int, int]:
        """Swap all faces in each frame of a video. Returns (video_bytes, total_frames, swapped_frames)."""
        if self.swapper is None:
            raise RuntimeError("Models not initialized")

        reference_face = self._prepare_reference_face(target_face_image)

        # Write temp input video
        import tempfile
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp_in:
            tmp_in.write(video_bytes)
            tmp_in_path = tmp_in.name

        cap = cv2.VideoCapture(tmp_in_path)
        if not cap.isOpened():
            os.unlink(tmp_in_path)
            raise ValueError("Cannot open video file")

        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        # Limit to 30 seconds
        max_frames = int(fps * 30)
        if total_frames > max_frames:
            total_frames = max_frames

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp_out:
            tmp_out_path = tmp_out.name

        writer = cv2.VideoWriter(tmp_out_path, fourcc, fps, (width, height))

        swapped_frames = 0
        frame_idx = 0

        while frame_idx < total_frames:
            ret, frame = cap.read()
            if not ret:
                break

            try:
                faces = self.app.get(frame)
                if len(faces) > 0:
                    result = frame.copy()
                    for face in faces:
                        result = self.swapper.get(result, face, reference_face, paste_back=True)
                    writer.write(result)
                    swapped_frames += 1
                else:
                    writer.write(frame)
            except Exception as e:
                print(f"Frame {frame_idx} error: {e}")
                writer.write(frame)

            frame_idx += 1

        cap.release()
        writer.release()
        os.unlink(tmp_in_path)

        with open(tmp_out_path, 'rb') as f:
            result_bytes = f.read()
        os.unlink(tmp_out_path)

        return result_bytes, total_frames, swapped_frames
