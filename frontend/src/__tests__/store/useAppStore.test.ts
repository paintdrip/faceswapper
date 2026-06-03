import { useAppStore } from '@/store/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().reset()
  })

  it('should have initial state', () => {
    const state = useAppStore.getState()
    expect(state.originalImage).toBeNull()
    expect(state.detectedFaces).toEqual([])
    expect(state.targetFaces).toEqual([])
    expect(state.resultImage).toBeNull()
    expect(state.status).toBe('idle')
    expect(state.progress).toBe(0)
    expect(state.error).toBeNull()
    expect(state.facesDetected).toBe(0)
  })

  it('should set original image', () => {
    useAppStore.getState().setOriginalImage('data:image/png;base64,test')
    expect(useAppStore.getState().originalImage).toBe('data:image/png;base64,test')
  })

  it('should set detected faces', () => {
    const faces = [{ id: 0, bbox: [0, 0, 10, 10], cropped: 'data:image/png;base64,abc' }]
    useAppStore.getState().setDetectedFaces(faces)
    expect(useAppStore.getState().detectedFaces).toEqual(faces)
    expect(useAppStore.getState().targetFaces).toEqual([null])
  })

  it('should set target face', () => {
    useAppStore.getState().setDetectedFaces([{ id: 0, bbox: [0, 0, 10, 10], cropped: 'data:image/png;base64,abc' }])
    useAppStore.getState().setTargetFace(0, 'data:image/png;base64,face')
    expect(useAppStore.getState().targetFaces[0]).toBe('data:image/png;base64,face')
  })

  it('should set result image', () => {
    useAppStore.getState().setResultImage('/api/results/test.png')
    expect(useAppStore.getState().resultImage).toBe('/api/results/test.png')
  })

  it('should set status and progress', () => {
    useAppStore.getState().setStatus('processing')
    useAppStore.getState().setProgress(50)
    expect(useAppStore.getState().status).toBe('processing')
    expect(useAppStore.getState().progress).toBe(50)
  })

  it('should set error', () => {
    useAppStore.getState().setError('Something went wrong')
    expect(useAppStore.getState().error).toBe('Something went wrong')
  })

  it('should set faces detected', () => {
    useAppStore.getState().setFacesDetected(3)
    expect(useAppStore.getState().facesDetected).toBe(3)
  })

  it('should reset to initial state', () => {
    useAppStore.getState().setOriginalImage('test')
    useAppStore.getState().setDetectedFaces([{ id: 0, bbox: [0, 0, 10, 10], cropped: 'data:image/png;base64,abc' }])
    useAppStore.getState().setStatus('completed')
    useAppStore.getState().reset()
    const state = useAppStore.getState()
    expect(state.originalImage).toBeNull()
    expect(state.detectedFaces).toEqual([])
    expect(state.status).toBe('idle')
  })
})
