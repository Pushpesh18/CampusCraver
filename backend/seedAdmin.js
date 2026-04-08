import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/user.js'
import dotenv from 'dotenv'

dotenv.config()

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✓ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' })
    if (existingAdmin) {
      console.log('⚠ Admin user already exists')
      process.exit(0)
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@canteen.local',
      fullName: 'Admin User',
      phone: '0000000000',
      college: 'Admin College',
      course: 'Admin Course',
      isVerified: true,
      role: 'admin'
    })

    await adminUser.save()
    console.log('✓ Admin user created successfully')
    console.log('  Username: admin')
    console.log('  Password: admin123')
    console.log('  Role: admin')

    process.exit(0)
  } catch (err) {
    console.error('✗ Error creating admin user:')
    console.error(`  ${err.message}`)
    process.exit(1)
  }
}

seedAdmin()
