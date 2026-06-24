import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import Post     from './models/Post.js'
import Media    from './models/Media.js'

dotenv.config()

const posts = [
  {
    title:         'Welcome to My Blog',
    slug:          'welcome-to-my-blog',
    content:       '<h2>Welcome!</h2><p>This is the first post on my blog.</p>',
    status:        'published',
    category:      'technology',
    featuredImage: 'https://picsum.photos/seed/hero/800/600',
  },
  {
    title:         'Getting Started with Vue',
    slug:          'getting-started-with-vue',
    content:       '<h2>Vue.js</h2><p>Vue is a progressive JavaScript framework.</p>',
    status:        'published',
    category:      'technology',
    featuredImage: '',
  },
  {
    title:         'CSS Tips and Tricks',
    slug:          'css-tips-and-tricks',
    content:       '<h2>CSS Tips</h2><p>Here are some useful CSS tricks.</p>',
    status:        'draft',
    category:      'design',
    featuredImage: '',
  },
  {
    title:         'Understanding Pinia',
    slug:          'pinia-guide',
    content:       '<h2>Pinia</h2><p>Pinia is the official state management for Vue 3.</p>',
    status:        'published',
    category:      'technology',
    featuredImage: '',
  },
  {
    title:         'Building a CMS',
    slug:          'build-cms',
    content:       '<h2>CMS</h2><p>Let us build a CMS from scratch.</p>',
    status:        'published',
    category:      'technology',
    featuredImage: '',
  },
  {
    title:         'Design Systems Explained',
    slug:          'design-systems',
    content:       '<h2>Design Systems</h2><p>Design tokens and component libraries.</p>',
    status:        'draft',
    category:      'design',
    featuredImage: '',
  },
  {
    title:         'Business Growth Tips',
    slug:          'business-growth',
    content:       '<h2>Business</h2><p>How to grow your business in 2026.</p>',
    status:        'published',
    category:      'business',
    featuredImage: '',
  },
]

const media = [
  {
    name: 'hero-banner.jpg',
    url:  'https://picsum.photos/seed/hero/800/600',
    size: 124000,
    type: 'image/jpeg',
  },
  {
    name: 'about-photo.jpg',
    url:  'https://picsum.photos/seed/about/800/600',
    size: 98000,
    type: 'image/jpeg',
  },
  {
    name: 'blog-cover.jpg',
    url:  'https://picsum.photos/seed/blog/800/600',
    size: 210000,
    type: 'image/jpeg',
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Post.deleteMany({})
    await Media.deleteMany({})
    console.log('🗑  Cleared existing data')

    // Insert fresh data
    await Post.insertMany(posts)
    await Media.insertMany(media)
    console.log('✅ Seed data inserted')

    console.log(`   📝 ${posts.length} posts created`)
    console.log(`   🖼  ${media.length} media files created`)

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}

seed()