const express = require("express");
const router = express.Router();
const commentController = require("../controllers/CommentController");
const { authenticateToken } = require("../middleware/middleware");

router.get("/", (req, res) => commentController.getAllComments(req, res));

router.get("/:id", (req, res) => commentController.getOneComment(req, res));

router.get("/product/:productId", (req, res) =>
  commentController.getCommentsByProductId(req, res)
);

router.post("/", (req, res) => commentController.createComment(req, res));

router.put("/:id", (req, res) => commentController.updateComment(req, res));

router.delete("/:id", (req, res) => commentController.deleteComment(req, res));

module.exports = router;
