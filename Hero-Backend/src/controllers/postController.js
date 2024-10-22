const PostService = require("../services/postService");

class PostController {
  async createPost(req, res) {
    try {
      const { body, status, score, media } = req.body;
      const userId = req.user.id;

      // media is already an array, no need to parse it
      const post = await PostService.createPost({
        body,
        userId,
        status,
        score,
        media,
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPostById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await PostService.getPostById(id);
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllPosts(req, res) {
    try {
      const { status, limit, offset } = req.query;
      const posts = await PostService.getAllPosts({
        status,
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePost(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { body, status, score } = req.body;
      const [updatedCount, updatedPosts] = await PostService.updatePost(id, {
        body,
        status,
        score,
      });
      if (updatedCount > 0) {
        res.json(updatedPosts[0]);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deletePost(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const deletedCount = await PostService.deletePost(id);
      if (deletedCount > 0) {
        res.json({ message: "Post deleted successfully" });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async approvePost(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const approverId = req.user.id; // Assuming you have user information in the request

      const approvedPost = await PostService.approvePost(id, approverId);
      if (approvedPost) {
        res.json(approvedPost);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PostController();
