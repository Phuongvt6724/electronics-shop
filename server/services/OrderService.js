const OrderModel = require("../models/OrderModel");

class OrderService {
  async getAllOrders() {
    return OrderModel.findAll();
  }

  async getOneOrder(id) {
    return OrderModel.findOne(id);
  }

  async getOneUser(id) {
    return OrderModel.findOneUser(id);
  }

  async getOneProduct(id) {
    return OrderModel.findProduct(id);
  }

  async findByProductIdAndMonth(productId, month, year) {
    return OrderModel.findByProductIdAndMonth(productId, month, year);
  }

  async getLastOrder() {
    return OrderModel.findLast();
  }

  async createOrder(category) {
    return OrderModel.insert(category);
  }

  async updateOrder(id, category) {
    return OrderModel.update(id, category);
  }

  async updateProduct(id, product) {
    return OrderModel.updateProduct(id, product);
  }

  async updateUser(id, order) {
    return OrderModel.updateUser(id, order);
  }

  async deleteOrder(id) {
    return OrderModel.delete(id);
  }
}

module.exports = new OrderService();
