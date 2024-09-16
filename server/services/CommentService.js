const CommentModel = require("../models/CommentModel");

class CommentService {
  async getAllComments() {
    return CommentModel.findAll();
  }

  async getOneComment(id) {
    return CommentModel.findOne(id).then((comment) => {
      if (!comment) {
        throw new Error("Comment not found");
      }
      return comment;
    });
  }

  async getCommentsByProductId(productId) {
    return CommentModel.findByProductId(productId);
  }

  async createComment(comment) {
    return CommentModel.insert(comment);
  }

  async updateComment(id, status) {
    return CommentModel.update(id, status);
  }

  async deleteComment(id) {
    return CommentModel.delete(id);
  }
}

module.exports = new CommentService();
