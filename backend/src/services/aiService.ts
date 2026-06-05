import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

interface ProcessResult {
  facesDetected: number
}

export async function detectFaces(imagePath: string): Promise<{ faces: any[]; count: number }> {
  const form = new FormData()
  form.append('image', fs.createReadStream(imagePath))

  const { data } = await axios.post(`${AI_SERVICE_URL}/detect`, form, {
    headers: form.getHeaders(),
    timeout: 60000,
  })

  return data
}

export async function processImage(
  sourcePath: string,
  targetFacePath: string,
  outputPath: string,
): Promise<ProcessResult> {
  const form = new FormData()
  form.append('source', fs.createReadStream(sourcePath))
  form.append('target_face', fs.createReadStream(targetFacePath))

  const response = await axios.post(`${AI_SERVICE_URL}/swap`, form, {
    headers: form.getHeaders(),
    responseType: 'stream',
    timeout: 300000,
  })

  const writer = fs.createWriteStream(outputPath)
  response.data.pipe(writer)

  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })

  const facesDetected = parseInt(response.headers['x-faces-detected'] || '0', 10)

  return { facesDetected }
}

export async function processImageMultiple(
  sourcePath: string,
  targetFacePaths: string[],
  outputPath: string,
): Promise<ProcessResult> {
  const form = new FormData()
  form.append('source', fs.createReadStream(sourcePath))
  targetFacePaths.forEach((p) => {
    form.append('target_faces', fs.createReadStream(p))
  })

  const response = await axios.post(`${AI_SERVICE_URL}/swap`, form, {
    headers: form.getHeaders(),
    responseType: 'stream',
    timeout: 300000,
  })

  const writer = fs.createWriteStream(outputPath)
  response.data.pipe(writer)

  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })

  const facesDetected = parseInt(response.headers['x-faces-detected'] || '0', 10)

  return { facesDetected }
}

export async function processVideo(
  sourcePath: string,
  targetFacePath: string,
  outputPath: string,
): Promise<{ totalFrames: number; swappedFrames: number }> {
  const form = new FormData()
  form.append('source', fs.createReadStream(sourcePath))
  form.append('target_face', fs.createReadStream(targetFacePath))

  try {
    const response = await axios.post(`${AI_SERVICE_URL}/swap-video`, form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer',
      timeout: 600000,
    })

    fs.writeFileSync(outputPath, Buffer.from(response.data))

    const totalFrames = parseInt(response.headers['x-total-frames'] || '0', 10)
    const swappedFrames = parseInt(response.headers['x-swapped-frames'] || '0', 10)

    return { totalFrames, swappedFrames }
  } catch (error: any) {
    if (error.response?.data) {
      let msg = error.response.data
      if (Buffer.isBuffer(msg)) {
        msg = msg.toString()
      }
      if (typeof msg === 'string') {
        try {
          const parsed = JSON.parse(msg)
          msg = parsed.detail || msg
        } catch {
          // keep as string
        }
      } else if (msg?.detail) {
        msg = msg.detail
      }
      throw new Error(msg)
    }
    throw error
  }
}
