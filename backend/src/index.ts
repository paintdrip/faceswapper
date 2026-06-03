import express from 'express'
import cors from 'cors'
import path from 'path'
import swapRoutes from './routes/swap'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/swap', swapRoutes)
app.use('/api/results', express.static(path.join(__dirname, '../uploads/results')))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})

export default app
