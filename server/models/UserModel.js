const { ObjectId } = require("mongodb");
const { client, dbName } = require("../dbConfig");

class UserModel {
  async connect() {
    await client.connect();
    return client.db(dbName);
  }

  async findAll() {
    const db = await this.connect();
    return db.collection("users").find({}).toArray();
  }

  async findOne(id) {
    const db = await this.connect();
    return db.collection("users").findOne({ _id: new ObjectId(id) });
  }

  async findUserByToken(token) {
    const db = await this.connect();
    return db.collection("users").findOne({ resetToken: token });
  }

  async findEmail(email) {
    const db = await this.connect();
    return db.collection("users").findOne({ email: email });
  }

  async insert(user) {
    const db = await this.connect();
    return db.collection("users").insertOne(user);
  }

  async update(id, user) {
    const db = await this.connect();
    return db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: user });
  }

  async updatePhone(id, phone) {
    const db = await this.connect();
    return db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { phone: phone } });
  }

  async updateStatusOrderByUser(id, user) {
    const db = await this.connect();
    return db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: user });
  }

  async delete(id) {
    const db = await this.connect();
    return db.collection("users").deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new UserModel();
