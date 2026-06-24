import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: true,
    trim:     true,
  },
  url: {
    type:     String,
    required: true,
  },
  size: {
    type:    Number,
    default: 0,
  },
  type: {
    type:    String,
    default: 'image/jpeg',
  },
}, {
  timestamps: true,
})

export default mongoose.model('Media', mediaSchema)