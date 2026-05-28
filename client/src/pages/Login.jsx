import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import Button from '../components/UI/Button'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/'
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth({ user: data.user, token: data.token })
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-card"
      >
        <div className="brand-gradient px-8 py-6 text-white">
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-white/85">Login to your VISO account</p>
        </div>
        <div className="p-8">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-sale/10 px-3 py-2.5 text-sm text-sale">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}
          <form onSubmit={submit} className="flex flex-col gap-4">
            <FieldIcon icon={Mail} type="email" placeholder="Email address" value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            <FieldIcon icon={Lock} type="password" placeholder="Password" value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
            <Button type="submit" disabled={loading} className="mt-1 w-full">
              {loading ? 'Signing in…' : 'Login'}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted">After seeding, try admin@viso.com / admin123</p>
          <p className="mt-4 border-t border-line pt-4 text-center text-sm text-muted">
            New to VISO?{' '}
            <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="font-semibold text-brand hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function FieldIcon({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
      <input {...props} className="h-11 w-full rounded-lg border border-line pl-10 pr-3 text-sm text-ink outline-none transition focus:border-brand" />
    </div>
  )
}
