import Product from '../models/Product.js'

class ProductDAO {
  getAll = () => Product.find()
  getById = id => Product.findById(id)
  create = data => Product.create(data)
  update = (id, data) => Product.findByIdAndUpdate(id, data, { new: true })
  delete = id => Product.findByIdAndDelete(id)
}

export default new ProductDAO()