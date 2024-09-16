const { client, dbName } = require("../dbConfig");
const { ObjectId } = require("mongodb");
class OrderModel {
  async connect() {
    await client.connect();
    return client.db(dbName);
  }

  async findAll() {
    const db = await this.connect();
    return db.collection("order").find({}).toArray();
  }

  async findOne(id) {
    const db = await this.connect();
    return db.collection("order").findOne({ _id: new ObjectId(id) });
  }

  async findProduct(id) {
    const db = await this.connect();
    return db.collection("products").findOne({ _id: new ObjectId(id) });
  }

  async findByProductIdAndMonth(productId, month, year) {
    const formattedMonth = month.toString().padStart(2, "0");
    const db = await this.connect();
    return db
      .collection("order")
      .find({
        "items.productId": productId,
        orderDate: { $regex: `${formattedMonth}-${year}` },
      })
      .toArray();
  }

  async findOneUser(id) {
    const db = await this.connect();
    return db.collection("users").findOne({ _id: new ObjectId(id) });
  }

  async insert(order) {
    const db = await this.connect();
    return db.collection("order").insertOne(order);
  }

  async update(id, order) {
    const db = await this.connect();
    return db
      .collection("order")
      .updateOne({ _id: new ObjectId(id) }, { $set: order });
  }

  async updateProduct(id, product) {
    const db = await this.connect();
    return db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: product });
  }

  async updateUser(id, order) {
    const db = await this.connect();
    return db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: order });
  }

  async delete(id) {
    const db = await this.connect();
    return db.collection("order").deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new OrderModel();
