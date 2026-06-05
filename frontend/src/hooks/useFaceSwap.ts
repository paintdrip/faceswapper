import { useMutation } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { detectFaces, uploadAndSwap, uploadAndSwapVideo } from '@/api/faceSwapApi'

export function useDetectFaces() {
  const { setStatus, setDetectedFaces, setError } = useAppStore()

  return useMutation({
    mutationFn: async (file: File) => {
      setStatus('detecting')
      const result = await detectFaces(file)
      return result
    },
    onSuccess: (data) => {
      setDetectedFaces(data.faces)
      setStatus('idle')
    },
    onError: (error: Error) => {
      setError(error.message || 'Face detection failed')
      setStatus('error')
    },
  })
}

export function useFaceSwap() {
  const { setStatus, setProgress, setResultImage, setError, setFacesDetected } = useAppStore()

  return useMutation({
    mutationFn: async ({ source, targetFaces }: { source: File; targetFaces: (File | null)[] }) => {
      setStatus('uploading')
      setProgress(0)

      const result = await uploadAndSwap(source, targetFaces, (progress) => {
        setProgress(progress)
        if (progress === 100) {
          setStatus('processing')
          setProgress(0)
        }
      })

      return result
    },
    onSuccess: (data) => {
      setResultImage(data.resultUrl)
      setFacesDetected(data.facesDetected)
      setStatus('completed')
      setProgress(100)
    },
    onError: (error: Error) => {
      setError(error.message || 'Processing failed')
      setStatus('error')
    },
  })
}

export function useVideoSwap() {
  const { setStatus, setProgress, setResultVideo, setError } = useAppStore()

  return useMutation({
    mutationFn: async ({ source, targetFace }: { source: File; targetFace: File }) => {
      setStatus('uploading')
      setProgress(0)

      const result = await uploadAndSwapVideo(source, targetFace, (progress) => {
        setProgress(progress)
        if (progress === 100) {
          setStatus('processing')
          setProgress(0)
        }
      })

      return result
    },
    onSuccess: (data) => {
      setResultVideo(data.resultUrl)
      setStatus('completed')
      setProgress(100)
    },
    onError: (error: Error) => {
      setError(error.message || 'Video processing failed')
      setStatus('error')
    },
  })
}
