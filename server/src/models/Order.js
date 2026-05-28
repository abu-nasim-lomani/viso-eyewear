import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: String, ref: 'Product', required: true }, // slug _id
        name: String,
        price: Number, // unit price snapshot (server-computed)
        qty: { type: Number, required: true, min: 1 },
        frameColor: String,
        lensColor: String,
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bkash', 'nagad', 'sslcommerz', 'card'],
      default: 'cod',
    },
    paymentResult: { id: String, status: String, transId: String, paidAt: Date },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
