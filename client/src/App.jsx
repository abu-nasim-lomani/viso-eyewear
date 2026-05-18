import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AnnouncementBar from './components/UI/AnnouncementBar'
import Header from './components/UI/Header'
import Footer from './components/UI/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-full flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
