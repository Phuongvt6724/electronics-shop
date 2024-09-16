const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { authenticateToken } = require("../middleware/middleware");

router.get("/", (req, res) => categoryController.getAllCategories(req, res));

router.get("/:id", (req, res) => categoryController.getOneCategories(req, res));

router.get("/brandid/:id", (req, res) =>
  categoryController.getOneCategoryByBrandId(req, res)
);
router.post("/", (req, res) => categoryController.createCategory(req, res));

router.put("/:id", (req, res) => categoryController.updateCategory(req, res));

router.delete("/:id", (req, res) =>
  categoryController.deleteCategory(req, res)
);

router.put("/order/:id", (req, res) =>
  categoryController.changeOrderCategory(req, res)
);

module.exports = router;
