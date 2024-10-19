const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router.post("/", postController.createPost);
router.get("/:id", postController.getPostById);
router.get("/", postController.getAllPosts);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.put("/approve/:id", postController.approvePost);

module.exports = router;
