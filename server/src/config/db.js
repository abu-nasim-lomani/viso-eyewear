import mongoose from 'mongoose'

/**
 * Connect to MongoDB. In production a failed connection is fatal; in
 * development we warn and keep the HTTP server running so the app still
 * boots (DB-backed routes will error until MONGODB_URI is set).
 */
export default async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri || uri.includes('<user>')) {
    console.warn('⚠  MONGODB_URI not configured — running without a database.')
    console.warn('   Add your MongoDB Atlas string to server/.env, then run `npm run seed`.')
    return false
  }
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(uri)
    console.log('✓ MongoDB connected')
    return true
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message)
    if (process.env.NODE_ENV === 'production') process.exit(1)
    return false
  }
}
