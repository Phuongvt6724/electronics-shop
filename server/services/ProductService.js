const ProductModel = require("../models/ProductModel");

class ProductService {
  async getAllProducts() {
    return ProductModel.findAll();
  }

  async getOneProduct(id) {
    return ProductModel.findOne(id);
  }

  async searchProducts(keyword) {
    return ProductModel.search(keyword);
  }

  async getProductsByCategory(category) {
    return ProductModel.findProductByCategory(category);
  }

  async createProduct(product) {
    return ProductModel.insert(product);
  }

  async updateProduct(id, product) {
    return ProductModel.update(id, product);
  }

  async deleteProduct(id) {
    return ProductModel.delete(id);
  }
}

module.exports = new ProductService();
