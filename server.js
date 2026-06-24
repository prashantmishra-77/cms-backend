import express  from 'express'
import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import cors     from 'cors'
import path     from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// ============================================
// MIDDLEWARE
// ============================================

// Allow Vue frontend to make requests
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cms-frontend-zeta.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Parse JSON request bodies
app.use(express.json())

// Serve uploaded files as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ============================================
// ROUTES
// ============================================

import postsRouter from './routes/posts.js'
import mediaRouter from './routes/media.js'

app.use('/api/posts', postsRouter)
app.use('/api/media', mediaRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    message: 'CMS API is running',
    time:    new Date().toISOString(),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Internal server error' })
})

// ============================================
// CONNECT TO MONGODB AND START SERVER
// ============================================

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`)
      console.log(`✅ API health: http://localhost:${PORT}/api/health`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })