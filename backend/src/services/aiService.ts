import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

interface ProcessResult {
  facesDetected: number
}

export async function processImage(inputPath: string, outputPath: string): Promise<ProcessResult> {
  const form = new FormData()
  form.append('image', fs.createReadStream(inputPath))

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
