import os
import sys
import cv2
import numpy as np
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from face_swap_service import FaceSwapService

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')

@pytest.fixture(scope="module")
def service():
    svc = FaceSwapService(models_dir=MODELS_DIR)
    return svc

def test_service_initialization(service):
    assert service.app is not None
    assert service.swapper is not None

def test_no_faces_in_source(service):
    blank = np.zeros((512, 512, 3), dtype=np.uint8)
    target_face = np.ones((128, 128, 3), dtype=np.uint8) * 255
    result, count = service.swap_faces(blank, target_face)
    assert count == 0
    assert result.shape == blank.shape

def test_no_face_in_target(service):
    blank = np.zeros((512, 512, 3), dtype=np.uint8)
    target_blank = np.zeros((128, 128, 3), dtype=np.uint8)
    with pytest.raises(ValueError, match="No face detected in target face image"):
        service.swap_faces(blank, target_blank)
