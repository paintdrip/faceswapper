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
