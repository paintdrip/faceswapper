import { create } from 'zustand'

export type ProcessingStatus = 'idle' | 'detecting' | 'uploading' | 'processing' | 'completed' | 'error'
export type SwapMode = 'photo' | 'video'

export interface DetectedFace {
  id: number
  bbox: number[]
  cropped: string
}

interface AppState {
  swapMode: SwapMode
  originalImage: string | null
  originalVideo: string | null
  detectedFaces: DetectedFace[]
  targetFaces: (string | null)[]
  resultImage: string | null
  resultVideo: string | null
  status: ProcessingStatus
  progress: number
  error: string | null
  facesDetected: number
  setSwapMode: (mode: SwapMode) => void
  setOriginalImage: (image: string | null) => void
  setOriginalVideo: (video: string | null) => void
  setDetectedFaces: (faces: DetectedFace[]) => void
  setTargetFace: (index: number, image: string | null) => void
  setResultImage: (image: string | null) => void
  setResultVideo: (video: string | null) => void
  setStatus: (status: ProcessingStatus) => void
  setProgress: (progress: number) => void
  setError: (error: string | null) => void
  setFacesDetected: (count: number) => void
  reset: () => void
}

const initialState = {
  swapMode: 'photo' as SwapMode,
  originalImage: null,
  originalVideo: null,
  detectedFaces: [] as DetectedFace[],
  targetFaces: [] as (string | null)[],
  resultImage: null,
  resultVideo: null,
  status: 'idle' as ProcessingStatus,
  progress: 0,
  error: null,
  facesDetected: 0,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setSwapMode: (mode) => set({ swapMode: mode }),
  setOriginalImage: (image) => set({ originalImage: image }),
  setOriginalVideo: (video) => set({ originalVideo: video }),
  setDetectedFaces: (faces) => set({ detectedFaces: faces, targetFaces: new Array(faces.length).fill(null) }),
  setTargetFace: (index, image) => set((state) => {
    const newTargets = [...state.targetFaces]
    newTargets[index] = image
    return { targetFaces: newTargets }
  }),
  setResultImage: (image) => set({ resultImage: image }),
  setResultVideo: (video) => set({ resultVideo: video }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  setFacesDetected: (count) => set({ facesDetected: count }),
  reset: () => set(initialState),
}))
