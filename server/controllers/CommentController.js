const CommentService = require("../services/CommentService");
const Joi = require("joi");

const commentSchema = Joi.object({
  _id: Joi.string(),
  productId: Joi.string().required(),
  nameUser: Joi.string().required(),
  content: Joi.string().required(),
  rating: Joi.number().required(),
  status: Joi.number().valid(1, 2),
});

class CommentController {
  async getAllComments(req, res) {
    try {
      const comments = await CommentService.getAllComments();
      res.status(200).json(comments);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getOneComment(req, res) {
    try {
      const id = req.params.id;
      const comment = await CommentService.getOneComment(id);
      res.status(200).json(comment);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getCommentsByProductId(req, res) {
    try {
      const productId = req.params.productId;
      const comments = await CommentService.getCommentsByProductId(productId);
      res.status(200).json(comments);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async createComment(req, res) {
    try {
      const { error, value } = commentSchema.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }

      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

      value.status = 1;
      value.date = formattedDate;

      await CommentService.createComment(value);
      res.status(201).json(value);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async updateComment(req, res) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const result = await CommentService.updateComment(id, { status });
      res.status(200).json(result);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      const id = req.params.id;
      await CommentService.deleteComment(id);
      res.status(204).send();
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error deleting the data");
    }
  }
}

module.exports = new CommentController();
