const PostModel = require("../models/postModel");
const sequelize = require("sequelize");

class PostService {
  async createPost(postData) {
    const { body, userId, status, score, media } = postData;

    // Ensure media is an array
    const mediaArray = Array.isArray(media) ? media : [];

    return PostModel.create({
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
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "user_type",
            "designation",
          ],
        },
        {
          association: "approver",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
      order: [
        ["author", "first_name", "ASC"], // Primary sort by author's first name
        ["updated_at", "DESC"], // Secondary sort by updated_at
      ],
      distinct: true,
    });

    return {
      posts: rows,
      totalCount: count,
      nextOffset: offset + rows.length < count ? offset + rows.length : null,
    };
  }

  async getAcceptedPosts({ limit = 10, offset = 0 }) {
    // Ensure limit and offset are numbers
    const numLimit = Number(limit);
    const numOffset = Number(offset);

    const { count, rows } = await PostModel.findAndCountAll({
      where: {
        status: "accepted",
      },
      limit: numLimit,
      offset: numOffset,
      include: [
        {
          association: "author",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "user_type",
            "designation",
          ],
        },
        {
          association: "approver",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
      order: [
        sequelize.literal('CASE WHEN "Post"."score" IS NULL THEN 1 ELSE 0 END'),
        [sequelize.col('"Post"."score"'), "ASC"],
        [sequelize.col('"Post"."updated_at"'), "DESC"],
      ],
      distinct: true,
    });

    // Log the query for debugging
    console.log("Query parameters:", { limit: numLimit, offset: numOffset });
    console.log("Results:", { count, rowCount: rows.length });

    return {
      posts: rows,
      totalCount: count,
      nextOffset:
        numOffset + rows.length < count ? numOffset + rows.length : null,
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

  async approvePost(postId, approverId) {
    const updatedPost = await PostModel.update(
      {
        status: "accepted",
        approvedBy: approverId,
        // approved_at will be set automatically by the trigger
      },
      {
        where: { id: postId },
        returning: true,
      }
    );

    if (!updatedPost[0]) {
      throw new Error("Post not found or could not be updated");
    }

    return updatedPost[1][0]; // Return the updated post
  }
}

module.exports = new PostService();
