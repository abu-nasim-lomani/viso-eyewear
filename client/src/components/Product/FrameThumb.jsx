/**
 * Lightweight SVG sunglasses thumbnail used as product imagery until real
 * photos / .glb renders are wired in. Colours come from the product so each
 * model looks distinct. `id` keeps gradient defs unique when many render
 * on one page.
 */
export default function FrameThumb({ product, className = '' }) {
  const { frameColor = '#1a1a1a', lensColor = '#1e3a5f', _id = 'x' } = product || {}
  const gid = `lens-${_id}`

  return (
    <svg
      viewBox="0 0 220 112"
      className={className}
      role="img"
      aria-label={`${product?.name || 'Sunglasses'} preview`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lensColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={lensColor} stopOpacity="0.68" />
        </linearGradient>
      </defs>

      {/* temple arms */}
      <path d="M24 42 L4 30" stroke={frameColor} strokeWidth="6" strokeLinecap="round" />
      <path d="M196 42 L216 30" stroke={frameColor} strokeWidth="6" strokeLinecap="round" />

      {/* nose bridge */}
      <path d="M92 40 q18 -11 36 0" stroke={frameColor} strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* lenses */}
      <rect x="22" y="32" width="72" height="58" rx="23" fill={`url(#${gid})`} stroke={frameColor} strokeWidth="7" />
      <rect x="126" y="32" width="72" height="58" rx="23" fill={`url(#${gid})`} stroke={frameColor} strokeWidth="7" />

      {/* glare highlights */}
      <path d="M32 80 L56 40" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="6" strokeLinecap="round" />
      <path d="M136 80 L160 40" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}
