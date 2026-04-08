import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes  from './routes/auth.js'
import menuRoutes  from './routes/menu.js'
import orderRoutes from './routes/order.js'
import adminRoutes from './routes/admin.js'

dotenv.config()
const app = express()
const httpServer = createServer(app)
export const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/api/auth',   authRoutes)
app.use('/api/menu',   menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin',  adminRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('✗ MongoDB connection failed:')
    console.error(`  ${err.message}`)
    console.warn('⚠ Server running without database - some features may not work')
  })

httpServer.listen(process.env.PORT, () =>
  console.log(`✓ Server running on port ${process.env.PORT}`)
)
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))