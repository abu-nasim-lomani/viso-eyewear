import mongoose from 'mongoose'

/**
 * `_id` is a human-readable slug (e.g. "phantom-x") so product URLs and the
 * frontend's existing shape stay unchanged — the API swap is drop-in.
 */
const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // slug
    name: { type: String, required: true },
    brand: { type: String, default: 'VISO' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    style: {
      type: String,
      enum: ['Aviator', 'Round', 'Wayfarer', 'Cat-Eye', 'Wrap', 'Shield', 'Browline'],
    },
    description: String,
    uvProtection: { type: String, default: 'UV400' },
    faceShapes: [{ type: String }],
    frameColor: String,
    lensColor: String,
    frameWidthMm: { type: Number, default: 140 }, // real width for AR true-to-size
    image: String, // optional primary photo (falls back to SVG on client)
    images: [{ type: String }], // gallery photos shown alongside the 3D view
    modelUrl: String, // optional .glb for the 3D viewer
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    freeShipping: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    tag: String,
  },
  { timestamps: true, _id: false }
)

export default mongoose.model('Product', productSchema)
