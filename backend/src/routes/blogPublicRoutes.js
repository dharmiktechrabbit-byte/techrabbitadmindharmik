const express = require("express");

const controller = require("../controllers/blogPublicController");

const router = express.Router();

router.get("/categories", controller.getBlogCategoriesPublic);
router.get("/", controller.getBlogsPublic);
router.get("/:slug", controller.getBlogPublicBySlug);

module.exports = router;
