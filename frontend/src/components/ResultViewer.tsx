import { motion } from 'framer-motion'
import { Download, RotateCcw } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'

export default function ResultViewer() {
  const { resultImage, setOriginalImage, setDetectedFaces, setResultImage, setStatus } = useAppStore()
  const { t } = useTranslation()

  if (!resultImage) return null

  const handleDownload = async () => {
    try {
      const response = await fetch(resultImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `faceswapper-result-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleReset = () => {
    setOriginalImage(null)
    setDetectedFaces([])
    setResultImage(null)
    setStatus('idle')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div className="glass-strong rounded-2xl overflow-hidden">
        <img
          src={resultImage}
          alt="Result"
          className="w-full h-96 object-contain bg-black/20"
        />
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primaryHover text-white font-medium transition-all hover:scale-105"
        >
          <Download className="w-5 h-5" />
          {t.downloadResult}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-white font-medium transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          {t.newPhoto}
        </button>
      </div>
    </motion.div>
  )
}
