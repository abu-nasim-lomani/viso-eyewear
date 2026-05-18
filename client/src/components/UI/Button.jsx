const variants = {
  primary: 'bg-viso-accent text-black hover:brightness-110',
  outline:
    'border border-white/25 text-white hover:bg-white/10 hover:border-white/40',
  ghost: 'text-white/80 hover:text-white hover:bg-white/10',
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
