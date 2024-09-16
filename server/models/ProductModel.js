const { client, dbName } = require("../dbConfig");
const { ObjectId } = require("mongodb");
class ProductModel {
  async connect() {
    await client.connect();
    return client.db(dbName);
  }

  async findAll() {
    const db = await this.connect();
    return db.collection("products").find({}).toArray();
  }

  async search(keyword) {
    const db = await this.connect();
    return db
      .collection("products")
      .find({ name: { $regex: keyword, $options: "i" } })
      .toArray();
  }

  async findProductByCategory(category) {
    const db = await this.connect();
    return db.collection("products").find({ brand: category }).toArray();
  }

  async findOne(id) {
    const db = await this.connect();
    return db.collection("products").findOne({ _id: new ObjectId(id) });
  }

  async insert(product) {
    const db = await this.connect();
    return db.collection("products").insertOne(product);
  }

  async update(id, product) {
    const db = await this.connect();
    await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: product });
    return this.findOne(id);
  }

  async delete(id) {
    const db = await this.connect();
    return db.collection("products").deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new ProductModel();
