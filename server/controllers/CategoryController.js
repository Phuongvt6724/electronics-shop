const CategoryService = require("../services/CategoryService");
const Joi = require("joi");

const categorySchema = Joi.object({
  _id: Joi.string(),
  brandId: Joi.number(),
  Name: Joi.string().required(),
  order: Joi.number(),
});

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getOneCategories(req, res) {
    try {
      const id = req.params.id;
      const category = await CategoryService.getOneCategories(id);
      res.status(200).json(category);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getOneCategoryByBrandId(req, res) {
    try {
      const brandId = parseInt(req.params.id);
      const result = await CategoryService.getOneCategoryByBrandId(brandId);
      res.status(201).json(result);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async createCategory(req, res) {
    try {
      const { error, value } = categorySchema.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }
      const existingCategory = await CategoryService.getOneCategoryByName(
        value.Name
      );
      if (existingCategory) {
        throw new Error("Tên danh mục đã tồn tại");
      }

      const maxBrandId = await CategoryService.getMaxBrandId();

      value.brandId = maxBrandId + 1;
      value.order = maxBrandId + 1;

      await CategoryService.createCategory(value);

      res.status(201).json(value);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      const { error, value } = categorySchema.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }

      const existingCategory = await CategoryService.getOneCategoryByName(
        value.Name
      );

      if (existingCategory && existingCategory._id.toString() !== id) {
        throw new Error(`Tên danh mục đã tồn tại`);
      }

      const result = await CategoryService.updateCategory(id, value);

      res.status(201).json(result);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const id = req.params.id;
      await CategoryService.deleteCategory(id);
      res.status(201).json(id);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error deleting the category");
    }
  }

  async changeOrderCategory(req, res) {
    try {
      const id = req.params.id;
      const { direction } = req.body;
      const categories = await CategoryService.changeOrderCategory(
        id,
        direction
      );
      res.status(201).json(categories);
    } catch (error) {
      console.error(error.stack);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController();
