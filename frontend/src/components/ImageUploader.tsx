import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils/cn'

interface ImageUploaderProps {
  imageKey: 'original' | 'targetFace'
  placeholder: string
  hint: string
}

export default function ImageUploader({ imageKey, placeholder, hint }: ImageUploaderProps) {
  const store = useAppStore()
  const image = imageKey === 'original' ? store.originalImage : store.targetFaceImage
  const setImage = imageKey === 'original' ? store.setOriginalImage : store.setTargetFaceImage
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = () => {
          setImage(reader.result as string)
          if (store.resultImage) {
            store.setResultImage(null)
          }
          if (store.status === 'completed' || store.status === 'error') {
            store.setStatus('idle')
          }
          store.setError(null)
        }
        reader.readAsDataURL(file)
      }
    },
    [setImage, store],
  )

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  const clearImage = () => {
    setImage(null)
    if (store.resultImage) {
      store.setResultImage(null)
    }
    store.setStatus('idle')
    store.setError(null)
  }

  if (image) {
    return (
      <div className="relative glass-strong rounded-2xl overflow-hidden">
        <img
          src={image}
          alt={imageKey === 'original' ? 'Source' : 'Target face'}
          className="w-full h-64 object-contain bg-black/20"
        />
        <button
          onClick={clearImage}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={cn(
          'glass rounded-2xl p-6 cursor-pointer transition-all duration-300',
          isDragActive && 'border-primary scale-[1.02]',
          isDragAccept && 'border-green-500',
          isDragReject && 'border-red-500'
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="p-4 rounded-2xl bg-primary/10">
            <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium mb-1">{placeholder}</p>
            <p className="text-sm text-gray-400">{hint}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
