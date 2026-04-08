import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  emoji:     { type: String, required: true },
  desc:      { type: String, default: '' },
  price:     { type: Number, required: true },
  category:  { type: String, default: 'Food' },
  tag:       { type: String, default: '' },
  available: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model('MenuItem', menuItemSchema)