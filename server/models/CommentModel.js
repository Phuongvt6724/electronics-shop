const { client, dbName } = require("../dbConfig");
const { ObjectId } = require("mongodb");

class CommentModel {
  async connect() {
    await client.connect();
    return client.db(dbName);
  }

  async findAll() {
    const db = await this.connect();
    return db.collection("comment").find({}).toArray();
  }

  async findOne(id) {
    const db = await this.connect();
    return db.collection("comment").findOne({ _id: new ObjectId(id) });
  }

  async findByProductId(productId) {
    const db = await this.connect();
    return db.collection("comment").find({ productId: productId }).toArray();
  }

  async insert(comment) {
    const db = await this.connect();
    return db.collection("comment").insertOne(comment);
  }

  async update(id, status) {
    const db = await this.connect();
    await db
      .collection("comment")
      .updateOne({ _id: new ObjectId(id) }, { $set: status });
    return db.collection("comment").findOne({ _id: new ObjectId(id) });
  }

  async delete(id) {
    const db = await this.connect();
    return db.collection("comment").deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new CommentModel();
