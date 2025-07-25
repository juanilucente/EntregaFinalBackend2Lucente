import { Router } from 'express'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import Ticket from '../models/Ticket.js'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

router.post('/:cartId/purchase', async (req, res) => {
  const cart = await Cart.findById(req.params.cartId).populate('products.product')
  if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' })

  let amount = 0
  const productsToKeep = []

  for (const item of cart.products) {
    if (item.product.stock >= item.quantity) {
      item.product.stock -= item.quantity
      await item.product.save()
      amount += item.product.price * item.quantity
    } else {
      productsToKeep.push(item)
    }
  }

  cart.products = productsToKeep
  await cart.save()

  const ticket = await Ticket.create({
    code: uuidv4(),
    amount,
    purchaser: req.user.email
  })

  res.json({ ticket, remaining: productsToKeep })
})

export default router