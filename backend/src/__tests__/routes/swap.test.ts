import request from 'supertest'
import fs from 'fs'
import path from 'path'
import app from '../../index'
import * as aiService from '../../services/aiService'

jest.mock('../../services/aiService')

describe('POST /api/swap', () => {
  const mockProcessImage = aiService.processImage as jest.MockedFunction<typeof aiService.processImage>

  beforeEach(() => {
    jest.clearAllMocks()
    mockProcessImage.mockResolvedValue({ facesDetected: 2 })
  })

  it('returns 400 when no image is provided', async () => {
    const res = await request(app).post('/api/swap').send()
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('No image provided')
  })

  it('processes image and returns result', async () => {
    const testImagePath = path.join(__dirname, '../../../uploads/test-image.png')
    fs.mkdirSync(path.dirname(testImagePath), { recursive: true })
    fs.writeFileSync(testImagePath, Buffer.from('fake-image-data'))

    const res = await request(app)
      .post('/api/swap')
      .attach('image', testImagePath)

    expect(res.status).toBe(200)
    expect(res.body.facesDetected).toBe(2)
    expect(res.body.resultUrl).toMatch(/\/api\/results\/result-/)

    fs.unlinkSync(testImagePath)
  })
})
