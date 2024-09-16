const UserModel = require("../models/UserModel");

class UserService {
  async getAllUsers() {
    return UserModel.findAll();
  }

  async getOneUser(id) {
    return UserModel.findOne(id);
  }

  async getUserByToken(token) {
    return UserModel.findUserByToken(token);
  }

  async findEmail(email) {
    return UserModel.findEmail(email);
  }

  async findLastUser() {
    return UserModel.findLastUser();
  }

  async createUser(user) {
    return UserModel.insert(user);
  }

  async updateUser(id, user) {
    return UserModel.update(id, user);
  }

  async updatePhone(id, phone) {
    return UserModel.updatePhone(id, phone);
  }

  async updateStatusOrderByUser(id, user) {
    return UserModel.updateStatusOrderByUser(id, user);
  }

  async deleteUser(id) {
    return UserModel.delete(id);
  }
}

module.exports = new UserService();
