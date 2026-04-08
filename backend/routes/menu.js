import express from 'express'
import MenuItem from '../models/menuitem.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'

const router = express.Router()

// GET /api/menu  — public, anyone can see the menu
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find()
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/menu  — admin only, add new item
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.create(req.body)
    res.status(201).json(item)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/menu/:id  — admin only, toggle availability or update
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(item)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/menu/:id  — admin only, remove item
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router