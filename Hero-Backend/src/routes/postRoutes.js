const express = require("express");
const { passport } = require("../auth/auth.js");

const postController = require("../controllers/postController");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);
router.get("/:id", postController.getPostById);
router.get("/", postController.getAllPosts);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);
router.delete("/:id", postController.deletePost);
router.put(
  "/approve/:id",
  passport.authenticate("jwt", { session: false }),
  postController.approvePost
);

module.exports = router;
