import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, ScanFace, ImageIcon, Video, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import ImageUploader from '@/components/ImageUploader'
import DetectedFaces from '@/components/DetectedFaces'
import ProcessingStatus from '@/components/ProcessingStatus'
import ResultViewer from '@/components/ResultViewer'
import { useAppStore } from '@/store/useAppStore'
import { useDetectFaces, useFaceSwap, useVideoSwap } from '@/hooks/useFaceSwap'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/utils/cn'

export default function FaceSwapPage() {
  const store = useAppStore()
  const { swapMode, originalImage, originalVideo, detectedFaces, targetFaces, status } = store
  const detectMutation = useDetectFaces()
  const swapMutation = useFaceSwap()
  const videoSwapMutation = useVideoSwap()
  const { t } = useTranslation()

  const [videoTargetFace, setVideoTargetFace] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDetect = async () => {
    if (!originalImage) return
    const response = await fetch(originalImage)
    const blob = await response.blob()
    const file = new File([blob], 'source.png', { type: blob.type })
    detectMutation.mutate(file)
  }

  const handleProcess = async () => {
    if (!originalImage || detectedFaces.length === 0) return
    const [sourceResponse] = await Promise.all([fetch(originalImage)])
    const sourceBlob = await sourceResponse.blob()
    const sourceFile = new File([sourceBlob], 'source.png', { type: sourceBlob.type })

    const targetFiles: (File | null)[] = await Promise.all(
      targetFaces.map(async (img) => {
        if (!img) return null
        const res = await fetch(img)
        const blob = await res.blob()
        return new File([blob], 'target.png', { type: blob.type })
      })
    )

    swapMutation.mutate({ source: sourceFile, targetFaces: targetFiles })
  }

  const handleVideoSwap = async () => {
    if (!originalVideo || !videoTargetFace) return
    const videoResponse = await fetch(originalVideo)
    const videoBlob = await videoResponse.blob()
    const videoFile = new File([videoBlob], 'source.mp4', { type: videoBlob.type })

    const targetResponse = await fetch(videoTargetFace)
    const targetBlob = await targetResponse.blob()
    const targetFile = new File([targetBlob], 'target.png', { type: targetBlob.type })

    videoSwapMutation.mutate({ source: videoFile, targetFace: targetFile })
  }

  const onVideoDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const url = URL.createObjectURL(file)
        store.setOriginalVideo(url)
        store.setOriginalImage(null)
        store.setDetectedFaces([])
        store.setResultImage(null)
        store.setResultVideo(null)
        if (store.status === 'completed' || store.status === 'error') {
          store.setStatus('idle')
        }
        store.setError(null)
      }
    },
    [store],
  )

  const onTargetDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = () => {
          setVideoTargetFace(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [],
  )

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragAccept: isVideoDragAccept, isDragReject: isVideoDragReject } = useDropzone({
    onDrop: onVideoDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  const { getRootProps: getTargetRootProps, getInputProps: getTargetInputProps } = useDropzone({
    onDrop: onTargetDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const isProcessing = status === 'detecting' || status === 'uploading' || status === 'processing'
  const canSwap = detectedFaces.length > 0 && targetFaces.some((t) => t !== null)
  const canVideoSwap = originalVideo && videoTargetFace

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 font-display">{t.swapPageTitle}</h1>
        <p className="text-gray-400">{t.swapPageSubtitle}</p>
      </motion.div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white/5 rounded-xl p-1 gap-1">
          <button
            onClick={() => store.setSwapMode('photo')}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all',
              swapMode === 'photo' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            <ImageIcon className="w-4 h-4" />
            {t.modePhoto}
          </button>
          <button
            onClick={() => store.setSwapMode('video')}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all',
              swapMode === 'video' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            <Video className="w-4 h-4" />
            {t.modeVideo}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {swapMode === 'photo' ? (
          <>
            {/* Source Upload */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">{t.sourceImageLabel}</h3>
              <ImageUploader
                imageKey="original"
                placeholder={t.sourceImagePlaceholder}
                hint={t.sourceImageHint}
              />
            </div>

            {/* Detect Button */}
            {originalImage && detectedFaces.length === 0 && status !== 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleDetect}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-medium transition-all hover:scale-105"
                >
                  {status === 'detecting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.detectingButton}
                    </>
                  ) : (
                    <>
                      <ScanFace className="w-5 h-5" />
                      {t.detectFacesButton}
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Detected Faces Grid */}
            <DetectedFaces />

            {/* Swap Button */}
            {detectedFaces.length > 0 && status !== 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || !canSwap}
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
          </>
        ) : (
          <>
            {/* Video Source Upload */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">{t.sourceVideoLabel}</h3>
              {originalVideo ? (
                <div className="relative glass-strong rounded-2xl overflow-hidden">
                  <video
                    src={originalVideo}
                    controls
                    className="w-full h-64 object-contain bg-black/20"
                  />
                  <button
                    onClick={() => {
                      store.setOriginalVideo(null)
                      store.setStatus('idle')
                      store.setError(null)
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div
                    className={cn(
                      'glass rounded-2xl p-6 cursor-pointer transition-all duration-300',
                      isDragActive && 'border-primary scale-[1.02]',
                      isVideoDragAccept && 'border-green-500',
                      isVideoDragReject && 'border-red-500'
                    )}
                    {...getVideoRootProps()}
                  >
                    <input {...getVideoInputProps()} />
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="p-4 rounded-2xl bg-primary/10">
                        <Video className="w-10 h-10 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium mb-1">{t.sourceVideoPlaceholder}</p>
                        <p className="text-sm text-gray-400">{t.sourceVideoHint}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Target Face for Video */}
            {originalVideo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-sm font-medium text-gray-300 mb-2">{t.targetFaceLabel}</h3>
                <p className="text-xs text-gray-500 mb-3">{t.swapVideoHint}</p>
                {videoTargetFace ? (
                  <div className="relative glass-strong rounded-2xl overflow-hidden w-48">
                    <img
                      src={videoTargetFace}
                      alt="Target"
                      className="w-full h-48 object-contain bg-black/20"
                    />
                    <button
                      onClick={() => setVideoTargetFace(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-primary w-48"
                    {...getTargetRootProps()}
                  >
                    <input {...getTargetInputProps()} />
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="p-3 rounded-2xl bg-primary/10">
                        <ImageIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{t.targetFacePlaceholder}</p>
                        <p className="text-xs text-gray-400">{t.targetFaceHint}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Video Swap Button */}
            {originalVideo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleVideoSwap}
                  disabled={isProcessing || !canVideoSwap}
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
                      {t.swapVideoButton}
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}

        <ProcessingStatus />
        <ResultViewer />
      </div>
    </div>
  )
}
