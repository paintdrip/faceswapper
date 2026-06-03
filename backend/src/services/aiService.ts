import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

interface ProcessResult {
  facesDetected: number
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
