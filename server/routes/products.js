const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authenticateToken } = require("../middleware/middleware");

router.get("/", (req, res) => ProductController.getAllProducts(req, res));

router.get("/:id", (req, res) => ProductController.getOneProduct(req, res));

router.get("/search/:keyword", (req, res) =>
  ProductController.searchProducts(req, res)
);

router.get("/category/:category", (req, res) =>
  ProductController.getProductsByCategory(req, res)
);

router.post("/", (req, res) => ProductController.createProduct(req, res));

router.put("/:id", (req, res) => ProductController.updateProduct(req, res));

router.put("/views/:id", (req, res) =>
  ProductController.updateProduct(req, res)
);

router.put("/increaseviews/:id", (req, res) =>
  ProductController.updateProductViews(req, res)
);

router.delete("/:id", (req, res) => ProductController.deleteProduct(req, res));

module.exports = router;
