const CategoryModel = require("../models/CategoryModel");

class CategoryService {
  async getAllCategories() {
    return CategoryModel.findAll();
  }

  async getOneCategories(id) {
    return CategoryModel.findOne(id);
  }

  async getOneCategoryByBrandId(id) {
    return CategoryModel.findOneByBrandId(id);
  }

  async getOneCategoryByName(name) {
    return CategoryModel.findByName(name);
  }

  async getMaxBrandId() {
    return CategoryModel.getMaxBrandId();
  }

  async createCategory(category) {
    return CategoryModel.insert(category);
  }

  async updateCategory(id, category) {
    return CategoryModel.update(id, category);
  }

  async deleteCategory(id) {
    return CategoryModel.delete(id);
  }

  async changeOrderCategory(id, order) {
    return CategoryModel.changeOrder(id, order);
  }
}

module.exports = new CategoryService();
