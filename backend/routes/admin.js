import express from 'express'
import Order from '../models/order.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'

const router = express.Router()

// GET /api/admin/stats  — revenue, total orders, items sold
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
    const totalItems   = orders.reduce((s, o) =>
      s + o.items.reduce((ss, i) => ss + i.qty, 0), 0)
    res.json({ totalOrders: orders.length, totalRevenue, totalItems })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/orders  — all orders (admin view)
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router