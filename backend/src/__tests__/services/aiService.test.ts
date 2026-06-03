import { processImage } from '../../services/aiService'
import axios from 'axios'
import fs from 'fs'

jest.mock('axios')
jest.mock('fs')

describe('aiService', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  it('processes image through AI service', async () => {
    const mockStream = { pipe: jest.fn() }
    mockedAxios.post.mockResolvedValue({
      data: mockStream,
      headers: { 'x-faces-detected': '3' },
    } as any)

    const mockWriter = {
      on: jest.fn((event: string, cb: Function) => {
        if (event === 'finish') cb()
      }),
    }
    ;(fs.createWriteStream as jest.Mock).mockReturnValue(mockWriter)
    ;(fs.createReadStream as jest.Mock).mockReturnValue({ on: jest.fn(), pause: jest.fn(), pipe: jest.fn() } as any)

    const result = await processImage('/input.png', '/output.png')
    expect(result.facesDetected).toBe(3)
  })
})
