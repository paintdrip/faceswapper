import { useMutation } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { uploadAndSwap } from '@/api/faceSwapApi'

export function useFaceSwap() {
  const { setStatus, setProgress, setResultImage, setError, setFacesDetected } = useAppStore()

  return useMutation({
    mutationFn: async (file: File) => {
      setStatus('uploading')
      setProgress(0)

      const result = await uploadAndSwap(file, (progress) => {
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
