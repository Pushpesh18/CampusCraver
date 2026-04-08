import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  name:  String,
  emoji: String,
  qty:   Number,
  price: Number
})

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:  [orderItemSchema],
  total:  { type: Number, required: true },
  method: { type: String, enum: ['UPI', 'Cash', 'Card'], required: true },
  status: {
    type: String,
    enum: ['placed', 'preparing', 'almost_ready', 'ready'],
    default: 'placed'
  }
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)