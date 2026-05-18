import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductViewer from '../components/Viewer3D/ProductViewer'
import ProductGrid from '../components/Product/ProductGrid'
import Button from '../components/UI/Button'
import { products } from '../data/products'

const usps = [
  {
    title: 'AR Virtual Try-On',
    desc: 'See frames on your face live',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.5 12S5.5 5 12 5s9.5 7 9.5 7-3 7-9.5 7-9.5-7-9.5-7z',
  },
  {
    title: 'Cash on Delivery',
    desc: 'Plus bKash, Nagad & card',
    icon: 'M3 10h18M7 15h1m4 0h1m-8 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    title: 'UV400 Protection',
    desc: '100% UVA / UVB blocked',
    icon: 'M12 3v2m0 14v2m9-9h-2M5 12H3m14.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m12.49 0l-1.41 1.41M6.46 17.54l-1.41 1.41M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    title: '7-Day Returns',
    desc: 'Easy, no-questions returns',
    icon: 'M4 4v6h6M20 20v-6h-6M20 8a8 8 0 00-14.93-2M4 16a8 8 0 0014.93 2',
  },
]

const styleCards = [
  { name: 'Aviator', color: '#b08d2e' },
  { name: 'Wayfarer', color: '#1e3a5f' },
  { name: 'Round', color: '#3b2a1a' },
  { name: 'Cat-Eye', color: '#7a2e4e' },
  { name: 'Shield', color: '#1f5f5a' },
]

const testimonials = [
  {
    name: 'Tanvir A.',
    city: 'Dhaka',
    text: 'AR try-on দেখে অর্ডার করেছি — একদম face-এ ঠিকঠাক বসেছে। দারুণ!',
  },
  {
    name: 'Sumaiya R.',
    city: 'Chattogram',
    text: 'Premium quality, fast delivery, bKash payment smooth. Highly recommend.',
  },
  {
    name: 'Rafiul I.',
    city: 'Sylhet',
    text: 'The 360° 3D view helped me pick the right frame before buying.',
  },
]

function Icon({ d }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d={d} />
    </svg>
  )
}

export default function Home() {
  const featured = products.filter((p) => p.isFeatured)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-viso-accent">
            AR Virtual Try-On
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            See it on your face
            <br />
            before you buy.
          </h1>
          <p className="mt-5 max-w-md text-white/60">
            Premium sunglasses with a real-time 3D viewer and webcam AR
            try-on. Drag the model to spin it 360°.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop">
              <Button>Shop Collection</Button>
            </Link>
            <Button variant="outline" disabled title="Coming in Phase 2">
              AR Try-On — Phase 2
            </Button>
          </div>
          <div className="mt-8 flex gap-8 text-sm text-white/50">
            <div>
              <p className="text-xl font-bold text-white">500+</p>
              Happy customers
            </div>
            <div>
              <p className="text-xl font-bold text-white">4.7★</p>
              Average rating
            </div>
            <div>
              <p className="text-xl font-bold text-white">UV400</p>
              All lenses
            </div>
          </div>
        </div>

        <ProductViewer
          frameColor={featured[0]?.frameColor}
          lensColor={featured[0]?.lensColor}
        />
      </section>

      {/* USP strip */}
      <section className="border-y border-white/10 bg-viso-surface/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4">
          {usps.map((u) => (
            <div key={u.title} className="flex items-center gap-3">
              <span className="text-viso-accent">
                <Icon d={u.icon} />
              </span>
              <div>
                <p className="text-sm font-semibold">{u.title}</p>
                <p className="text-xs text-white/50">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Style */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold">Shop by Style</h2>
        <p className="mt-1 text-sm text-white/50">
          Find the shape that fits you
        </p>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {styleCards.map((s) => (
            <Link
              key={s.name}
              to="/shop"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-viso-surface p-5 transition hover:border-white/25"
            >
              <span
                className="h-12 w-24 rounded-[40%] border-4 transition group-hover:scale-105"
                style={{
                  borderColor: s.color,
                  background: `${s.color}55`,
                }}
              />
              <span className="text-sm font-semibold">{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Bestsellers</h2>
          <Link
            to="/shop"
            className="text-sm text-white/60 hover:text-white"
          >
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* AR Try-On showcase */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-viso-surface to-viso-bg p-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-viso-accent">
              The VISO difference
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Try every frame on,
              <br />
              right from your camera.
            </h2>
            <p className="mt-4 max-w-md text-white/60">
              Our AR engine tracks 468 facial points in real time and
              places the 3D sunglasses precisely on your face — tilt and
              turn your head, it follows. Snap a photo and share your look.
            </p>
            <div className="mt-7">
              <Button variant="outline" disabled title="Coming in Phase 2">
                Launch AR Try-On — Phase 2
              </Button>
            </div>
          </div>
          <ProductViewer
            frameColor={featured[1]?.frameColor}
            lensColor={featured[1]?.lensColor}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold">What customers say</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/10 bg-viso-surface p-6"
            >
              <p className="text-viso-accent">★★★★★</p>
              <p className="mt-3 text-sm text-white/70">“{t.text}”</p>
              <p className="mt-4 text-sm font-semibold">
                {t.name}{' '}
                <span className="font-normal text-white/40">
                  · {t.city}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-viso-accent px-8 py-12 text-center text-black">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Get ৳200 off your first order
          </h2>
          <p className="mt-2 text-sm text-black/70">
            Subscribe for new drops, offers & styling tips.
          </p>
          {subscribed ? (
            <p className="mt-6 font-semibold">
              🎉 Subscribed! Check your inbox.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.trim()) setSubscribed(true)
              }}
              className="mx-auto mt-6 flex max-w-md gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 rounded-full bg-black/10 px-5 py-3 text-sm text-black placeholder-black/40 outline-none focus:bg-black/15"
              />
              <button
                type="submit"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
