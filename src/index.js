import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import sessionRouter from './routes/session.routes.js'
import recoveryRouter from './routes/recovery.routes.js'
import ticketRouter from './routes/ticket.routes.js'
import currentRouter from './routes/current.routes.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB Connected'))
  .catch(err => console.error('🔴 MongoDB connection error:', err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 3600
  }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/recovery', recoveryRouter)
app.use('/api/tickets', ticketRouter)
app.use('/api/current', currentRouter)

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))