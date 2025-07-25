import { Router } from 'express'
import repo from '../repositories/ProductRepository.js'
import { requireRole } from '../middlewares/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  const products = await repo.getProducts()
  res.json(products)
})

router.post('/', requireRole('admin'), async (req, res) => {
  const product = await repo.createProduct(req.body)
  res.status(201).json(product)
})

router.put('/:id', requireRole('admin'), async (req, res) => {
  const updated = await repo.updateProduct(req.params.id, req.body)
  res.json(updated)
})

router.delete('/:id', requireRole('admin'), async (req, res) => {
  await repo.deleteProduct(req.params.id)
  res.sendStatus(204)
})

export default router