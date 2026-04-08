import nodemailer from 'nodemailer'

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString()

export const sendOTPEmail = async (toEmail, otp) => {
  try {
    console.log('Trying to send OTP...')
    console.log('EMAIL_USER:', process.env.EMAIL_USER)
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded ✅' : 'NOT LOADED ❌')

    // ✅ Create transporter INSIDE the function so env vars are already loaded
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const info = await transporter.sendMail({
      from: `"CampusCraver" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your CampusCraver OTP',
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;border-radius:12px;border:1px solid #eee">
          <h2 style="color:#E8612C">🍽️ CampusCraver</h2>
          <p>Your OTP for registration is:</p>
          <h1 style="letter-spacing:8px;color:#3D1A00">${otp}</h1>
          <p style="color:#999;font-size:13px">Valid for 10 minutes. Do not share this with anyone.</p>
        </div>
      `
    })
    console.log('Email sent successfully:', info.messageId)
  } catch (err) {
    console.error('EMAIL ERROR:', err.message)
    throw err
  }
}