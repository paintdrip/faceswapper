import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle, ScanFace } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'

export default function ProcessingStatus() {
  const { status, progress, error, facesDetected } = useAppStore()
  const { t } = useTranslation()

  if (status === 'idle') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 space-y-4"
    >
      {status === 'detecting' && (
        <div className="flex items-center gap-3">
          <ScanFace className="w-5 h-5 animate-pulse text-primary" />
          <span>{t.detectingButton}</span>
        </div>
      )}

      {status === 'uploading' && (
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>{t.processingUpload}</span>
          <span className="ml-auto text-sm text-gray-400">{progress}%</span>
        </div>
      )}

      {status === 'processing' && (
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>{t.processingAI}</span>
        </div>
      )}

      {(status === 'uploading' || status === 'processing') && (
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {status === 'completed' && (
        <div className="flex items-center gap-3 text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <span>{t.completed} {facesDetected}.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
    </motion.div>
  )
}
