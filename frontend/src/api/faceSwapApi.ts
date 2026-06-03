import axios from 'axios'

const API_BASE = '/api'

export interface SwapResult {
  resultUrl: string
  facesDetected: number
}

export async function uploadAndSwap(
  sourceFile: File,
  targetFaceFile: File,
  onProgress?: (progress: number) => void,
): Promise<SwapResult> {
  const formData = new FormData()
  formData.append('source', sourceFile)
  formData.append('target_face', targetFaceFile)

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
