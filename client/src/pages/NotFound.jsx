import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'
import Button from '../components/UI/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-card"
      >
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-3 text-xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/"><Button><Home size={16} /> Go Home</Button></Link>
          <Link to="/shop"><Button variant="outline"><Search size={16} /> Browse Shop</Button></Link>
        </div>
      </motion.div>
    </div>
  )
}
