import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Product from './models/Product.js'
import User from './models/User.js'
import { products } from './data/products.js'

const run = async () => {
  const ok = await connectDB()
  if (!ok) {
    console.error('✗ Cannot seed without a database. Set MONGODB_URI in server/.env first.')
    process.exit(1)
  }

  await Product.deleteMany({})
  await Product.insertMany(products)
  console.log(`✓ Seeded ${products.length} products`)

  const adminEmail = 'admin@viso.com'
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({ name: 'VISO Admin', email: adminEmail, password: 'admin123', role: 'admin' })
    console.log('✓ Created admin login → admin@viso.com / admin123  (change this!)')
  }

  await mongoose.disconnect()
  console.log('✓ Done.')
  process.exit(0)
}

run()
