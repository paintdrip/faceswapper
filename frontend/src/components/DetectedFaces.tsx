import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils/cn'
import { useTranslation } from '@/i18n/useTranslation'

export default function DetectedFaces() {
  const { detectedFaces, targetFaces, setTargetFace } = useAppStore()
  const { t } = useTranslation()

  if (detectedFaces.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">
        {t.detectedFacesTitle} {detectedFaces.length}
      </h3>
      <p className="text-sm text-gray-400">{t.selectAllTargets}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {detectedFaces.map((face, index) => (
          <FaceCard
            key={face.id}
            index={index}
            face={face}
            targetImage={targetFaces[index]}
            onSetTarget={setTargetFace}
          />
        ))}
      </div>
    </motion.div>
  )
}

interface FaceCardProps {
  index: number
  face: { id: number; bbox: number[]; cropped: string }
  targetImage: string | null
  onSetTarget: (index: number, image: string | null) => void
}

function FaceCard({ index, face, targetImage, onSetTarget }: FaceCardProps) {
  const { t } = useTranslation()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = () => {
          onSetTarget(index, reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [index, onSetTarget],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div className="space-y-2">
      <div className="relative">
        <img
          src={face.cropped}
          alt={`Face ${index + 1}`}
          className="w-full h-32 object-cover rounded-xl border border-white/10"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-xs text-white font-medium">
          {t.faceNumber} {index + 1}
        </div>
      </div>

      {targetImage ? (
        <div className="relative">
          <img
            src={targetImage}
            alt={`Target ${index + 1}`}
            className="w-full h-32 object-cover rounded-xl border border-primary/50"
          />
          <button
            onClick={() => onSetTarget(index, null)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-500/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 right-2 text-center">
            <span className="px-2 py-0.5 rounded-md bg-primary/80 text-xs text-white font-medium">
              {t.changeFace}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2',
            isDragActive
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <ImageIcon className="w-6 h-6 text-gray-500" />
          <span className="text-xs text-gray-500 text-center px-2">
            {t.targetFacePlaceholder}
          </span>
        </div>
      )}
    </div>
  )
}
