import { create } from 'zustand'

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'

interface AppState {
  originalImage: string | null
  targetFaceImage: string | null
  resultImage: string | null
  status: ProcessingStatus
  progress: number
  error: string | null
  facesDetected: number
  setOriginalImage: (image: string | null) => void
  setTargetFaceImage: (image: string | null) => void
  setResultImage: (image: string | null) => void
  setStatus: (status: ProcessingStatus) => void
  setProgress: (progress: number) => void
  setError: (error: string | null) => void
  setFacesDetected: (count: number) => void
  reset: () => void
}

const initialState = {
  originalImage: null,
  targetFaceImage: null,
  resultImage: null,
  status: 'idle' as ProcessingStatus,
  progress: 0,
  error: null,
  facesDetected: 0,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setOriginalImage: (image) => set({ originalImage: image }),
  setTargetFaceImage: (image) => set({ targetFaceImage: image }),
  setResultImage: (image) => set({ resultImage: image }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  setFacesDetected: (count) => set({ facesDetected: count }),
  reset: () => set(initialState),
}))
