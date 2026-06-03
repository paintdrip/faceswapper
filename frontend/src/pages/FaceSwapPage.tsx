import { motion } from 'framer-motion'
import { Wand2 } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import ProcessingStatus from '@/components/ProcessingStatus'
import ResultViewer from '@/components/ResultViewer'
import { useAppStore } from '@/store/useAppStore'
import { useFaceSwap } from '@/hooks/useFaceSwap'
import { useTranslation } from '@/i18n/useTranslation'

export default function FaceSwapPage() {
  const { originalImage, targetFaceImage, status } = useAppStore()
  const swapMutation = useFaceSwap()
  const { t } = useTranslation()

  const handleProcess = async () => {
    if (!originalImage || !targetFaceImage) return

    const [sourceResponse, targetResponse] = await Promise.all([
      fetch(originalImage),
      fetch(targetFaceImage),
    ])
    const [sourceBlob, targetBlob] = await Promise.all([
      sourceResponse.blob(),
      targetResponse.blob(),
    ])
    const sourceFile = new File([sourceBlob], 'source.png', { type: sourceBlob.type })
    const targetFile = new File([targetBlob], 'target_face.png', { type: targetBlob.type })
    swapMutation.mutate({ source: sourceFile, targetFace: targetFile })
  }

  const isProcessing = status === 'uploading' || status === 'processing'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">{t.swapPageTitle}</h1>
        <p className="text-gray-400">
          {t.swapPageSubtitle}
        </p>
      </motion.div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">{t.sourceImageLabel}</h3>
            <ImageUploader
              imageKey="original"
              placeholder={t.sourceImagePlaceholder}
              hint={t.sourceImageHint}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">{t.targetFaceLabel}</h3>
            <ImageUploader
              imageKey="targetFace"
              placeholder={t.targetFacePlaceholder}
              hint={t.targetFaceHint}
            />
          </div>
        </div>

        {originalImage && targetFaceImage && status !== 'completed' && (
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
                  {t.processingButton}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {t.swapButton}
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
