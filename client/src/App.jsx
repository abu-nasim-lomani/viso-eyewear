import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import AnnouncementBar from './components/UI/AnnouncementBar'
import Header from './components/UI/Header'
import Footer from './components/UI/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'
import Policy from './pages/Policy'
import NotFound from './pages/NotFound'
import api from './utils/api'
import { useAuthStore } from './store/authStore'

const Admin = lazy(() => import('./pages/Admin'))

/* Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

/* Validate the persisted JWT on load; refresh user or log out if invalid. */
function AuthBootstrap() {
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logout = useAuthStore((s) => s.logout)
  useEffect(() => {
    if (!token) return
    api.get('/auth/me')
      .then(({ data }) => setAuth({ user: data.user, token }))
      .catch((err) => { if (err.response?.status === 401) logout() })
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthBootstrap />

      <AnnouncementBar />
      <Header />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="shell px-4 py-24 text-center text-sm text-muted">Loading admin…</div>}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Policy doc="privacy" />} />
          <Route path="/terms" element={<Policy doc="terms" />} />
          <Route path="/returns" element={<Policy doc="returns" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}
