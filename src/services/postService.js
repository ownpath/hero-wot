const PostModel = require("../models/postModel");
const sequelize = require("sequelize");

class PostService {
  async createPost(postData) {
    const { title, body, userId, status, score, media } = postData;

    // Ensure media is an array
    const mediaArray = Array.isArray(media) ? media : [];

    return PostModel.create({
      title,
      body,
      userId,
      status,
      score,
      media: mediaArray,
    });
  }

  async getPostById(id) {
    return PostModel.findByPk(id, {
      include: [
        {
          association: "author",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          association: "approver",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
    });
  }

  async getAllPosts({ status, limit = 10, offset = 0 }) {
    const whereClause = status ? { status } : {};

    const { count, rows } = await PostModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          association: "author",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          association: "approver",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              "CONCAT(author.first_name, ' ', COALESCE(author.last_name, ''))"
            ),
            "author_full_name",
          ],
          [
            sequelize.literal(
              "CONCAT(approver.first_name, ' ', COALESCE(approver.last_name, ''))"
            ),
            "approver_full_name",
          ],
        ],
      },
      order: [["updated_at", "DESC"]],
    });

    return {
      posts: rows,
      totalCount: count,
      nextOffset: offset + rows.length < count ? offset + rows.length : null,
    };
  }

  async updatePost(id, postData) {
    return PostModel.update(postData, {
      where: { id },
      returning: true,
    });
  }

  async deletePost(id) {
    return PostModel.destroy({
      where: { id },
    });
  }

  async approvePost(id, approverId) {
    const post = await PostModel.findByPk(id);
    if (post) {
      post.status = "accepted";
      post.approvedBy = approverId;
      post.approvedAt = new Date();
      await post.save();
      return post;
    }
    return null;
  }
}

module.exports = new PostService();
