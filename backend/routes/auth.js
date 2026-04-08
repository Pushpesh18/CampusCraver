import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { protect } from '../middleware/auth.js'
import { generateOTP, sendOTPEmail } from '../utils/sendotp.js'
import { upload } from '../utils/upload.js'

const router = express.Router()

// ── STEP 1 of register: send OTP to email ──
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    const exists = await User.findOne({ email, isVerified: true })
    if (exists) return res.status(400).json({ error: 'Email already registered' })

    const otp       = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    // save OTP temporarily against this email
    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry, isVerified: false },
      { upsert: true, new: true }
    )

    await sendOTPEmail(email, otp)
    res.json({ message: 'OTP sent to your email' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send OTP' })
  }
})

// ── STEP 2 of register: verify OTP ──
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email })

    if (!user || user.otp !== otp)
      return res.status(400).json({ error: 'Invalid OTP' })

    if (new Date() > user.otpExpiry)
      return res.status(400).json({ error: 'OTP expired, request a new one' })

    res.json({ message: 'OTP verified' })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── STEP 3 of register: complete registration ──
router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    const { username, password, fullName, phone, email, college, course, otp } = req.body

    // re-verify OTP for safety
    const tempUser = await User.findOne({ email })
    if (!tempUser || tempUser.otp !== otp)
      return res.status(400).json({ error: 'OTP not verified' })
    if (new Date() > tempUser.otpExpiry)
      return res.status(400).json({ error: 'OTP expired' })

    // check username not taken
    const usernameTaken = await User.findOne({ username })
    if (usernameTaken)
      return res.status(400).json({ error: 'Username already taken' })

    const hash = await bcrypt.hash(password, 10)

    const updated = await User.findOneAndUpdate(
      { email },
      {
        username,
        password:   hash,
        fullName,
        phone,
        college,
        course,
        photo:      req.file ? req.file.filename : '',
        isVerified: true,
        otp:        null,
        otpExpiry:  null
      },
      { new: true }
    )

    const token = jwt.sign(
      { id: updated._id, role: updated.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, role: updated.role, username: updated.username })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── LOGIN ──
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user)
      return res.status(401).json({ error: 'Invalid credentials' })
    if (!user.isVerified)
      return res.status(401).json({ error: 'Please verify your email first' })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, role: user.role, username: user.username })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET current user ──
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -otp -otpExpiry')
  res.json(user)
})

export default router