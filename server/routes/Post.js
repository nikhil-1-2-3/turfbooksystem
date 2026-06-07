const express = require("express");
const router = express.Router();
const postController = require("../controllers/Post");
const { auth } = require("../middlewares/auth");

router.post("/createPost", auth, postController.createPost);
router.get("/getAllPosts", auth, postController.getAllPosts);
router.post("/deletePost", auth, postController.deletePost);

module.exports = router;
