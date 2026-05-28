/**
 * Realistic sunglasses overlay for AR — translucent tinted lenses (skin shows
 * through faintly), glossy reflections, a metallic frame sheen, and a soft
 * contact shadow so the frame looks like it's resting on the face.
 * Far more "real product" than the flat catalog thumbnail.
 */
export default function ARGlasses({ frameColor = '#1a1a1a', lensColor = '#1e3a5f', id = 'ar', className = '' }) {
  const f = id
  // lens rects: left x=33, right x=129 (78×60, r27) within a 240×100 viewBox
  const lenses = [33, 129]
  return (
    <svg viewBox="0 0 240 100" className={className} style={{ overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id={`lens-${f}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={lensColor} stopOpacity="0.58" />
          <stop offset="55%" stopColor={lensColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={lensColor} stopOpacity="0.92" />
        </linearGradient>
        <radialGradient id={`glow-${f}`} cx="0.3" cy="0.24" r="0.7">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`shadow-${f}`} x="-40%" y="-40%" width="180%" height="200%">
          <feGaussianBlur stdDeviation="3.6" />
        </filter>
      </defs>

      {/* soft contact shadow on the face */}
      <g transform="translate(0,7)" opacity="0.22" filter={`url(#shadow-${f})`}>
        {lenses.map((x) => <rect key={x} x={x} y="20" width="78" height="60" rx="27" fill="#000" />)}
      </g>

      {/* tinted, translucent lenses + reflections */}
      {lenses.map((x) => (
        <g key={x}>
          <rect x={x} y="20" width="78" height="60" rx="27" fill={`url(#lens-${f})`} />
          <rect x={x} y="20" width="78" height="60" rx="27" fill={`url(#glow-${f})`} />
          <path
            d={`M ${x + 13} ${66} Q ${x + 20} ${30} ${x + 50} ${28}`}
            stroke="#ffffff" strokeOpacity="0.4" strokeWidth="5" fill="none" strokeLinecap="round"
          />
          <circle cx={x + 60} cy={64} r="4" fill="#ffffff" opacity="0.18" />
        </g>
      ))}

      {/* frame */}
      <g fill="none" stroke={frameColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {lenses.map((x) => <rect key={x} x={x} y="20" width="78" height="60" rx="27" />)}
        <path d="M111 36 q9 -8 18 0" />
        <path d="M33 37 L5 27" />
        <path d="M207 37 L235 27" />
      </g>

      {/* metallic top sheen + dark lower edge for depth */}
      <g fill="none" strokeLinecap="round">
        <path d="M42 27 q30 -9 60 1" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2.4" />
        <path d="M138 27 q30 -9 60 1" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2.4" />
        <path d="M44 77 q28 8 56 0" stroke="#000000" strokeOpacity="0.25" strokeWidth="2.2" />
        <path d="M140 77 q28 8 56 0" stroke="#000000" strokeOpacity="0.25" strokeWidth="2.2" />
      </g>

      {/* hinge dots */}
      <g fill={frameColor}>
        <circle cx="35" cy="36" r="3.4" />
        <circle cx="205" cy="36" r="3.4" />
      </g>
    </svg>
  )
}
