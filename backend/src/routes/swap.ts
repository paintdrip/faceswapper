import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { processImage } from '../services/aiService'

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

const upload = multer({
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

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' })
    }

    const inputPath = req.file.path
    const outputFilename = `result-${uuidv4()}.png`
    const outputPath = path.join(resultsDir, outputFilename)

    const result = await processImage(inputPath, outputPath)

    fs.unlinkSync(inputPath)

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

export default router
