import { motion } from 'framer-motion'
import { Wand2 } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import ProcessingStatus from '@/components/ProcessingStatus'
import ResultViewer from '@/components/ResultViewer'
import { useAppStore } from '@/store/useAppStore'
import { useFaceSwap } from '@/hooks/useFaceSwap'

export default function FaceSwapPage() {
  const { originalImage, status } = useAppStore()
  const swapMutation = useFaceSwap()

  const handleProcess = async () => {
    if (!originalImage) return

    const response = await fetch(originalImage)
    const blob = await response.blob()
    const file = new File([blob], 'upload.png', { type: blob.type })
    swapMutation.mutate(file)
  }

  const isProcessing = status === 'uploading' || status === 'processing'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Оформление</h1>
        <p className="text-gray-400">
          Загрузи фото, и мы заменим все найденные лица на лицо Димы Данилина.
        </p>
      </motion.div>

      <div className="space-y-6">
        <ImageUploader />

        {originalImage && status !== 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-medium transition-all hover:scale-105"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Оформить
                </>
              )}
            </button>
          </motion.div>
        )}

        <ProcessingStatus />
        <ResultViewer />
      </div>
    </div>
  )
}
