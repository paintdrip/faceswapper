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

router.post('/', upload.fields([
  { name: 'source', maxCount: 1 },
  { name: 'target_face', maxCount: 1 },
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if (!files?.source?.[0] || !files?.target_face?.[0]) {
      return res.status(400).json({ error: 'Both source and target_face images are required' })
    }

    const sourcePath = files.source[0].path
    const targetFacePath = files.target_face[0].path
    const outputFilename = `result-${uuidv4()}.png`
    const outputPath = path.join(resultsDir, outputFilename)

    const result = await processImage(sourcePath, targetFacePath, outputPath)

    fs.unlinkSync(sourcePath)
    fs.unlinkSync(targetFacePath)

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
