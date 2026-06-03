import axios from 'axios'

const API_BASE = '/api'

export interface SwapResult {
  resultUrl: string
  facesDetected: number
}

export interface DetectedFace {
  id: number
  bbox: number[]
  cropped: string
}

export async function detectFaces(image: File): Promise<{ faces: DetectedFace[]; count: number }> {
  const formData = new FormData()
  formData.append('image', image)

  const { data } = await axios.post(`${API_BASE}/swap/detect`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export async function uploadAndSwap(
  sourceFile: File,
  targetFaceFiles: (File | null)[],
  onProgress?: (progress: number) => void,
): Promise<SwapResult> {
  const formData = new FormData()
  formData.append('source', sourceFile)

  const validTargets = targetFaceFiles.filter((f): f is File => f !== null)
  validTargets.forEach((file) => {
    formData.append('target_faces', file)
  })

  const { data } = await axios.post(`${API_BASE}/swap`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      }
    },
  })

  return data
}

export function getResultUrl(filename: string): string {
  return `${API_BASE}/results/${filename}`
}
