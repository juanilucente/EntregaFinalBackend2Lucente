import dao from '../dao/ProductDAO.js'

class ProductRepository {
  getProducts() { return dao.getAll() }
  getProduct(id) { return dao.getById(id) }
  createProduct(data) { return dao.create(data) }
  updateProduct(id, data) { return dao.update(id, data) }
  deleteProduct(id) { return dao.delete(id) }
}

export default new ProductRepository()