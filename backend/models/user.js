import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true, trim: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },

  // new fields
  fullName:   { type: String, default: '' },
  phone:      { type: String, default: '' },
  email:      { type: String, default: '', unique: true, sparse: true },
  college:    { type: String, default: '' },
  course:     { type: String, default: '' },
  photo:      { type: String, default: '' },  // stores filename
  isVerified: { type: Boolean, default: false },

  // OTP
  otp:        { type: String, default: null },
  otpExpiry:  { type: Date,   default: null }
}, { timestamps: true })

export default mongoose.model('User', userSchema)