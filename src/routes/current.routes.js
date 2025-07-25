import { Router } from 'express'
import userDTO from '../dto/user.dto.js'

const router = Router()

router.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  const safeUser = userDTO(req.user)
  res.json(safeUser)
})

export default router