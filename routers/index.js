// 路由配置
const Router = require('koa-router')
const router = new Router();

const Category = require('../model/category');
const Tag = require('../model/tag');
const Article = require('../model/article');

// router.prefix('/queryUsers') //接口前缀

// admin api
router.get("/category", Category.getCategoryList);
router.post("/category", Category.addCategory);
router.put("/category", Category.updateCategory);
router.delete("/category", Category.deleteCategory);

router.get("/tag", Tag.getTagList);
router.post("/tag", Tag.addTag);
router.put("/tag", Tag.updateTag);
router.delete("/tag", Tag.deleteTag);

router.get("/article", Article.getArticleList);
router.post("/article", Article.addArticle);
router.delete("/article", Article.deleteArticle);
router.get("/article/detail", Article.getArticleDetail);
router.put("/article/publish", Article.isPubilshArticle);


// blog api

module.exports = router;