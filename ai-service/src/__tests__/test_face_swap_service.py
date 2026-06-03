import os
import sys
import cv2
import numpy as np
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from face_swap_service import FaceSwapService

TEST_FACE_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'face.png')
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')

@pytest.fixture(scope="module")
def service():
    if not os.path.exists(TEST_FACE_PATH):
        pytest.skip("face.png not found")
    svc = FaceSwapService(
        face_path=TEST_FACE_PATH,
        models_dir=MODELS_DIR,
    )
    return svc

def test_service_initialization(service):
    assert service.app is not None
    assert service.swapper is not None
    assert service.reference_face is not None

def test_no_faces(service):
    blank = np.zeros((512, 512, 3), dtype=np.uint8)
    result, count = service.swap_faces(blank)
    assert count == 0
    assert result.shape == blank.shape

def test_swap_with_dummy_image(service):
    img = np.random.randint(0, 255, (640, 480, 3), dtype=np.uint8)
    result, count = service.swap_faces(img)
    assert isinstance(count, int)
    assert result.shape == img.shape
