import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type:     String,
    required: [true, 'Title is required'],
    trim:     true,
  },
  slug: {
    type:     String,
    required: [true, 'Slug is required'],
    unique:   true,
    trim:     true,
    lowercase: true,
  },
  content: {
    type:    String,
    default: '',
  },
  status: {
    type:    String,
    enum:    ['draft', 'published'],
    default: 'draft',
  },
  category: {
    type:    String,
    default: '',
  },
  featuredImage: {
    type:    String,
    default: '',
  },
}, {
  timestamps: true,   // adds createdAt and updatedAt automatically
})

export default mongoose.model('Post', postSchema)