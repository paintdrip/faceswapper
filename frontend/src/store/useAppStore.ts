import { create } from 'zustand'

export type ProcessingStatus = 'idle' | 'detecting' | 'uploading' | 'processing' | 'completed' | 'error'

export interface DetectedFace {
  id: number
  bbox: number[]
  cropped: string
}

interface AppState {
  originalImage: string | null
  detectedFaces: DetectedFace[]
  targetFaces: (string | null)[]
  resultImage: string | null
  status: ProcessingStatus
  progress: number
  error: string | null
  facesDetected: number
  setOriginalImage: (image: string | null) => void
  setDetectedFaces: (faces: DetectedFace[]) => void
  setTargetFace: (index: number, image: string | null) => void
  setResultImage: (image: string | null) => void
  setStatus: (status: ProcessingStatus) => void
  setProgress: (progress: number) => void
  setError: (error: string | null) => void
  setFacesDetected: (count: number) => void
  reset: () => void
}

const initialState = {
  originalImage: null,
  detectedFaces: [] as DetectedFace[],
  targetFaces: [] as (string | null)[],
  resultImage: null,
  status: 'idle' as ProcessingStatus,
  progress: 0,
  error: null,
  facesDetected: 0,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setOriginalImage: (image) => set({ originalImage: image }),
  setDetectedFaces: (faces) => set({ detectedFaces: faces, targetFaces: new Array(faces.length).fill(null) }),
  setTargetFace: (index, image) => set((state) => {
    const newTargets = [...state.targetFaces]
    newTargets[index] = image
    return { targetFaces: newTargets }
  }),
  setResultImage: (image) => set({ resultImage: image }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  setFacesDetected: (count) => set({ facesDetected: count }),
  reset: () => set(initialState),
}))
