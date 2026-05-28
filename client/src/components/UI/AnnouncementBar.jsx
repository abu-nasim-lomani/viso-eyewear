import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Truck } from 'lucide-react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="relative brand-gradient text-white">
      <div className="shell flex items-center justify-between px-4 py-1.5 text-xs">
        <p className="flex items-center gap-1.5">
          <Truck size={14} />
          <span className="font-semibold">Free delivery over ৳3,000</span>
          <span className="hidden text-white/60 sm:inline">·</span>
          <span className="hidden sm:inline">bKash · Nagad · Cash on Delivery</span>
        </p>
        <div className="flex items-center gap-4 pr-6">
          <Link to="/shop" className="hidden hover:underline sm:inline">Track Order</Link>
          <Link to="/shop" className="hidden hover:underline sm:inline">Help</Link>
          <span className="font-semibold">৳200 off 1st order</span>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
