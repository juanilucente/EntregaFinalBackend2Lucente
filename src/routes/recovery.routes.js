import { Router } from 'express'
import crypto from 'crypto'
import User from '../models/User.js'
import { sendRecoveryMail } from '../services/mail.service.js'
import { createHash, isValidPassword } from '../utils/bcrypt.js'

const tokens = new Map()
const router = Router()

router.post('/request', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: 'No existe usuario' })

  const token = crypto.randomBytes(20).toString('hex')
  tokens.set(token, { email, expires: Date.now() + 3600000 })
  await sendRecoveryMail(email, token)
  res.json({ message: 'Correo enviado' })
})

router.post('/reset', async (req, res) => {
  const { token, password } = req.body
  const data = tokens.get(token)
  if (!data || Date.now() > data.expires) return res.status(400).json({ message: 'Token expirado' })

  const user = await User.findOne({ email: data.email })
  if (isValidPassword(user, password)) return res.status(400).json({ message: 'No uses la misma contraseña' })

  user.password = createHash(password)
  await user.save()
  tokens.delete(token)
  res.json({ message: 'Contraseña actualizada' })
})

export default router