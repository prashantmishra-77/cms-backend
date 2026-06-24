import express from 'express'
import multer  from 'multer'
import path    from 'path'
import fs      from 'fs'
import Media   from '../models/Media.js'

const router = express.Router()

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const ext  = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    if (ext && mime) return cb(null, true)
    cb(new Error('Only image files are allowed'))
  },
})

// GET all media
router.get('/', async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 })
    res.json(media)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST upload file
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const media = new Media({
      name: req.file.originalname,
      url:  `http://localhost:5000/uploads/${req.file.filename}`,
      size: req.file.size,
      type: req.file.mimetype,
    })

    const saved = await media.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST save external URL
router.post('/', async (req, res) => {
  try {
    const media = new Media(req.body)
    const saved = await media.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE media
router.delete('/:id', async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id)
    if (!media) return res.status(404).json({ message: 'Media not found' })

    if (media.url.includes('/uploads/')) {
      const filename = media.url.split('/uploads/')[1]
      const filepath = `uploads/${filename}`
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
    }

    res.json({ message: 'Media deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router