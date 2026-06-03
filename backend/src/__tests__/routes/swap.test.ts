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

  it('returns 400 when images are not provided', async () => {
    const res = await request(app).post('/api/swap').send()
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Both source and target_face images are required')
  })

  it('returns 400 when only source is provided', async () => {
    const testImagePath = path.join(__dirname, '../../../uploads/test-image.png')
    fs.mkdirSync(path.dirname(testImagePath), { recursive: true })
    fs.writeFileSync(testImagePath, Buffer.from('fake-image-data'))

    const res = await request(app)
      .post('/api/swap')
      .attach('source', testImagePath)

    expect(res.status).toBe(400)
    fs.unlinkSync(testImagePath)
  })

  it('processes images and returns result', async () => {
    const testImagePath = path.join(__dirname, '../../../uploads/test-image.png')
    fs.mkdirSync(path.dirname(testImagePath), { recursive: true })
    fs.writeFileSync(testImagePath, Buffer.from('fake-image-data'))

    const res = await request(app)
      .post('/api/swap')
      .attach('source', testImagePath)
      .attach('target_face', testImagePath)

    expect(res.status).toBe(200)
    expect(res.body.facesDetected).toBe(2)
    expect(res.body.resultUrl).toMatch(/\/api\/results\/result-/)

    fs.unlinkSync(testImagePath)
  })
})
