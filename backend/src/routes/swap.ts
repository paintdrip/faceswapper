import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { detectFaces, processImage, processImageMultiple, processVideo } from '../services/aiService'

const router = Router()

const uploadsDir = path.join(__dirname, '../../uploads')
const resultsDir = path.join(uploadsDir, 'results')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`
    cb(null, uniqueName)
  },
})

const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'))
    }
  },
})

const videoUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/webp',
      'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
      'application/octet-stream',
    ]
    const allowedExt = ['.mp4', '.mov', '.avi', '.webm', '.png', '.jpg', '.jpeg', '.webp']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedMimes.includes(file.mimetype) || allowedExt.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only images (JPEG, PNG, WebP) and videos (MP4, MOV, AVI, WEBM) are allowed.'))
    }
  },
})

router.post('/detect', imageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' })
    }
    const result = await detectFaces(req.file.path)
    fs.unlinkSync(req.file.path)
    return res.json(result)
  } catch (error) {
    console.error('Detect error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Face detection failed',
    })
  }
})

router.post('/', imageUpload.fields([
  { name: 'source', maxCount: 1 },
  { name: 'target_face', maxCount: 1 },
  { name: 'target_faces', maxCount: 20 },
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if (!files?.source?.[0]) {
      return res.status(400).json({ error: 'Source image is required' })
    }

    const sourcePath = files.source[0].path
    const outputFilename = `result-${uuidv4()}.png`
    const outputPath = path.join(resultsDir, outputFilename)

    let result
    // Multiple target faces mode
    if (files.target_faces && files.target_faces.length > 0) {
      const targetPaths = files.target_faces.map(f => f.path)
      result = await processImageMultiple(sourcePath, targetPaths, outputPath)
      targetPaths.forEach(p => fs.unlinkSync(p))
    } else if (files.target_face?.[0]) {
      const targetPath = files.target_face[0].path
      result = await processImage(sourcePath, targetPath, outputPath)
      fs.unlinkSync(targetPath)
    } else {
      fs.unlinkSync(sourcePath)
      return res.status(400).json({ error: 'Target face image(s) are required' })
    }

    fs.unlinkSync(sourcePath)

    return res.json({
      resultUrl: `/api/results/${outputFilename}`,
      facesDetected: result.facesDetected,
    })
  } catch (error) {
    console.error('Swap error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Face swap failed',
    })
  }
})

router.post('/video', videoUpload.fields([
  { name: 'source', maxCount: 1 },
  { name: 'target_face', maxCount: 1 },
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if (!files?.source?.[0]) {
      return res.status(400).json({ error: 'Source video is required' })
    }
    if (!files?.target_face?.[0]) {
      return res.status(400).json({ error: 'Target face image is required' })
    }

    const sourcePath = files.source[0].path
    const targetPath = files.target_face[0].path
    const outputFilename = `video-${uuidv4()}.mp4`
    const outputPath = path.join(resultsDir, outputFilename)

    const result = await processVideo(sourcePath, targetPath, outputPath)

    fs.unlinkSync(sourcePath)
    fs.unlinkSync(targetPath)

    return res.json({
      resultUrl: `/api/results/${outputFilename}`,
      totalFrames: result.totalFrames,
      swappedFrames: result.swappedFrames,
    })
  } catch (error) {
    console.error('Video swap error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Video face swap failed',
    })
  }
})

export default router
