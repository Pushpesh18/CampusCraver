import express from 'express'
import Order from '../models/order.js'
import { protect } from '../middleware/auth.js'
import { io } from '../server.js'

const router = express.Router()

// POST /api/orders  — place a new order (logged in users only)
router.post('/', protect, async (req, res) => {
  try {
    const { items, total, method } = req.body
    const order = await Order.create({
      userId: req.user.id,
      items, total, method
    })

    // tell all connected clients a new order arrived (admin dashboard)
    io.emit('new_order', order)

    res.status(201).json({
      id:     order._id,
      time:   order.createdAt,
      method: order.method,
      items:  order.items,
      total:  order.total,
      status: order.status
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/orders  — get current user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/orders/:id/status  — admin updates order status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )

    // push live update to all clients
    io.emit('order_update', { id: order._id, status: order.status })

    res.json(order)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router