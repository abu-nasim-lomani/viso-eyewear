/**
 * Mock catalog for Phase 1. Replaced by the Products API
 * (GET /api/products) in Phase 1 Week 2. Shape mirrors the
 * Mongoose Product schema (plan §9) so the swap is drop-in.
 */
export const products = [
  {
    _id: 'phantom-x',
    name: 'Phantom X',
    brand: 'VISO',
    price: 3200,
    originalPrice: 4500,
    style: 'Wayfarer',
    description:
      'Bold acetate Wayfarer with UV400 polarized lenses. An everyday classic.',
    uvProtection: 'UV400',
    faceShapes: ['Oval', 'Square', 'Heart'],
    frameColor: '#1a1a1a',
    lensColor: '#1e3a5f',
    rating: 4.7,
    numReviews: 36,
    isFeatured: true,
    tag: 'Bestseller',
  },
  {
    _id: 'aero-gold',
    name: 'Aero Gold',
    brand: 'VISO',
    price: 4100,
    originalPrice: 5200,
    style: 'Aviator',
    description:
      'Gold metal Aviator frame with gradient amber lenses. Timeless pilot style.',
    uvProtection: 'UV400',
    faceShapes: ['Oval', 'Heart', 'Square'],
    frameColor: '#b08d2e',
    lensColor: '#5a3a1e',
    rating: 4.5,
    numReviews: 21,
    isFeatured: true,
    tag: 'New',
  },
  {
    _id: 'luna-round',
    name: 'Luna Round',
    brand: 'VISO',
    price: 2800,
    style: 'Round',
    description:
      'Retro round frame in matte tortoise. Lightweight and characterful.',
    uvProtection: 'UV400',
    faceShapes: ['Square', 'Diamond'],
    frameColor: '#3b2a1a',
    lensColor: '#2e2e2e',
    rating: 4.3,
    numReviews: 14,
    isFeatured: true,
    tag: null,
  },
  {
    _id: 'eclipse-shield',
    name: 'Eclipse Shield',
    brand: 'VISO',
    price: 5400,
    originalPrice: 6800,
    style: 'Shield',
    description:
      'Single-lens sport shield with mirrored coating. Maximum coverage.',
    uvProtection: 'UV400',
    faceShapes: ['Oval', 'Round'],
    frameColor: '#0d0d0d',
    lensColor: '#1f5f5a',
    rating: 4.8,
    numReviews: 9,
    isFeatured: false,
    tag: 'Pro',
  },
]

export function getProductById(id) {
  return products.find((p) => p._id === id) ?? null
}
