/**
 * Self-ping keep-alive for hosts that sleep on inactivity (Render free tier
 * spins down after ~15 min). The server hits its own public health endpoint
 * every PING_MINUTES — the incoming HTTP request resets the inactivity timer
 * so the dyno stays warm.
 *
 * Activated only when NODE_ENV=production and SELF_URL is set. No external
 * dependency (uses Node's built-in fetch).
 */
const PING_MINUTES = 5

export function startKeepAlive() {
  const base = process.env.SELF_URL
  if (process.env.NODE_ENV !== 'production' || !base) return
  const target = base.replace(/\/$/, '') + '/api/health'

  const ping = async () => {
    try {
      const res = await fetch(target, { method: 'GET' })
      console.log(`[keepalive] ${res.status} ${target}`)
    } catch (err) {
      console.warn('[keepalive] ping failed:', err.message)
    }
  }

  // Stagger the first ping so it doesn't fire mid-boot.
  setTimeout(ping, 30 * 1000)
  setInterval(ping, PING_MINUTES * 60 * 1000)
  console.log(`✓ Keep-alive enabled — pinging ${target} every ${PING_MINUTES} min`)
}
