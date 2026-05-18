export default function AnnouncementBar() {
  return (
    <div className="bg-viso-accent text-black">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-2 text-center text-xs font-semibold sm:text-sm">
        <span>🚚 Free delivery over ৳3,000</span>
        <span className="opacity-40">·</span>
        <span>Cash on Delivery + bKash / Nagad</span>
        <span className="hidden opacity-40 sm:inline">·</span>
        <span className="hidden sm:inline">৳200 off your first order</span>
      </div>
    </div>
  )
}
