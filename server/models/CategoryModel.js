const { client, dbName } = require("../dbConfig");
const { ObjectId } = require("mongodb");

class CategoryModel {
  async connect() {
    await client.connect();
    return client.db(dbName);
  }

  async findAll() {
    const db = await this.connect();
    const categorys = await db.collection("category").find({}).toArray();
    const categorysSorted = categorys.sort((a, b) => a.order - b.order);
    return categorysSorted;
  }

  async findOne(id) {
    const db = await this.connect();
    return db.collection("category").findOne({ _id: new ObjectId(id) });
  }

  async findByName(name) {
    const db = await this.connect();
    return db
      .collection("category")
      .findOne({ Name: { $regex: new RegExp(`^${name}$`, "i") } });
  }

  async getMaxBrandId() {
    const db = await this.connect();
    const maxBrand = await db
      .collection("category")
      .find({})
      .sort({ brandId: -1 })
      .limit(1)
      .toArray();
    return maxBrand.length ? maxBrand[0].brandId : 0;
  }

  async findOneByBrandId(id) {
    const db = await this.connect();
    return db.collection("category").findOne({ brandId: id });
  }

  async insert(category) {
    const db = await this.connect();
    return db.collection("category").insertOne(category);
  }

  async update(id, category) {
    const db = await this.connect();
    await db
      .collection("category")
      .updateOne({ _id: new ObjectId(id) }, { $set: category });
    return this.findOne(id);
  }

  async delete(id) {
    const db = await this.connect();
    return db.collection("category").deleteOne({ _id: new ObjectId(id) });
  }

  async changeOrder(id, direction) {
    const db = await this.connect();
    const categorys = await this.findAll();
    const category = await this.findOne(id);
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }

    if (category.order === 1 && direction === "up") {
      throw new Error("Vị trí danh mục không thể di chuyển lên");
    }

    if (category.order === categorys.length && direction === "down") {
      throw new Error("Vị trí danh mục không thể di chuyển xuống");
    }

    if (direction !== "up" && direction !== "down") {
      throw new Error("Hướng di chuyển không hợp lệ");
    }

    const currentOrder = category.order;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    const swapCategory = await db
      .collection("category")
      .findOne({ order: newOrder });

    if (!swapCategory) {
      throw new Error(`Không thể tìm thấy danh mục để đổi vị trí`);
    }

    await db
      .collection("category")
      .updateOne({ _id: new ObjectId(id) }, { $set: { order: newOrder } });
    await db
      .collection("category")
      .updateOne(
        { _id: new ObjectId(swapCategory._id) },
        { $set: { order: currentOrder } }
      );

    return this.findAll();
  }
}

module.exports = new CategoryModel();
