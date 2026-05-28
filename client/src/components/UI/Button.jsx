import { motion } from 'framer-motion'

/* VISO buttons — modern eyewear-commerce.
   primary = commerce orange · accent = 3D/AR indigo · ink = structure */
const base =
  'relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold leading-none transition-colors duration-150 select-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand/40'

const sizes = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-[15px]',
}

const variants = {
  /* main commerce CTA */
  primary: 'bg-brand text-white shadow-[0_8px_18px_-8px_rgba(251,86,7,.55)] hover:bg-brand-dark',

  /* 3D / AR feature CTA */
  accent: 'bg-accent text-white shadow-[0_8px_18px_-8px_rgba(67,97,238,.55)] hover:bg-accent-dark focus-visible:ring-accent/40',

  /* dark structural */
  ink: 'bg-ink text-white hover:bg-black',

  /* secondary commerce (Add to Cart) */
  soft: 'bg-brand-soft text-brand hover:bg-[#ffe3d3]',

  /* neutral */
  outline: 'bg-white text-ink border border-line hover:border-ink/40 hover:bg-card-alt',

  /* AR outline */
  'outline-accent': 'bg-white text-accent border border-accent/40 hover:bg-accent-soft',

  link: 'px-0 py-0 text-brand hover:text-brand-dark hover:underline rounded-none',
  ghost: 'text-ink-soft hover:bg-card-alt',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const sizing = variant === 'link' ? '' : sizes[size]
  return (
    <motion.button
      whileTap={{ scale: props.disabled || variant === 'link' ? 1 : 0.98 }}
      className={`${base} ${sizing} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
