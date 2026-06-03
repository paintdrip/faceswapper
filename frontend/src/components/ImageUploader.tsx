import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils/cn'

export default function ImageUploader() {
  const { originalImage, setOriginalImage, setResultImage, setStatus, setError } = useAppStore()
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = () => {
          setOriginalImage(reader.result as string)
          setResultImage(null)
          setStatus('idle')
          setError(null)
        }
        reader.readAsDataURL(file)
      }
    },
    [setOriginalImage, setResultImage, setStatus, setError]
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
    setOriginalImage(null)
    setResultImage(null)
    setStatus('idle')
    setError(null)
  }

  if (originalImage) {
    return (
      <div className="relative glass-strong rounded-2xl overflow-hidden">
        <img
          src={originalImage}
          alt="Original"
          className="w-full h-96 object-contain bg-black/20"
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
          'glass rounded-2xl p-8 cursor-pointer transition-all duration-300',
          isDragActive && 'border-primary scale-[1.02]',
          isDragAccept && 'border-green-500',
          isDragReject && 'border-red-500'
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="p-4 rounded-2xl bg-primary/10">
            <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium mb-1">Перетащи фото сюда</p>
            <p className="text-sm text-gray-400">
              или кликни для выбора файла (PNG, JPG до 10 МБ)
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
