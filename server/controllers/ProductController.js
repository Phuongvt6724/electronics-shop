const express = require("express");
const ProductService = require("../services/ProductService");
const Joi = require("joi");

const productSchema = Joi.object({
  _id: Joi.string(),
  name: Joi.string().required(),
  brand: Joi.number().required(),
  priceOrigin: Joi.number().required(),
  priceNow: Joi.number().required(),
  hot: Joi.boolean().default(false),
  types: Joi.array()
    .items(
      Joi.object({
        color: Joi.string().required(),
        image: Joi.string().required(),
        quantity: Joi.number().required(),
      })
    )
    .default([]),
  views: Joi.number().min(0).default(0),
  status: Joi.number().default(1),
});

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await ProductService.getOneProduct(id);
      res.status(200).json(product);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async searchProducts(req, res) {
    try {
      const keyword = req.params.keyword;
      const products = await ProductService.searchProducts(keyword);
      res.status(200).json(products);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const category = parseInt(req.params.category);
      const products = await ProductService.getProductsByCategory(category);
      res.status(200).json(products);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async createProduct(req, res) {
    try {
      const { error, value } = productSchema.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }
      await ProductService.createProduct(value);
      res.status(201).json(value);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      const { error, value } = productSchema.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }
      const result = await ProductService.updateProduct(id, value);
      res.status(201).json(result);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async updateProductViews(req, res) {
    try {
      const id = req.params.id;
      const product = await ProductService.getOneProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.views++;

      await ProductService.updateProduct(id, product);

      res.status(200).json(product);
    } catch (error) {
      console.error(error.stack);
      res.status(500).json({ message: "Error updating product views" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      await ProductService.deleteProduct(id);
      res.status(201).json(id);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error deleting the product");
    }
  }
}

module.exports = new ProductController();
