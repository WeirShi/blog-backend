// 路由配置
const Router = require('koa-router')
const router = new Router();

const Category = require('../model/category');
const Tag = require('../model/tag');
const Article = require('../model/article');

// router.prefix('/queryUsers') //接口前缀

// admin api
router.get("/category", Category.getCategoryList)
    .post("/category", Category.addCategory)
    .put("/category", Category.updateCategory)
    .delete("/category", Category.deleteCategory)

    .get("/tag", Tag.getTagList)
    .post("/tag", Tag.addTag)
    .put("/tag", Tag.updateTag)
    .delete("/tag", Tag.deleteTag)

    .get("/article", Article.getArticleList)
    .post("/article", Article.addArticle)
    .delete("/article", Article.deleteArticle)
    .get("/article/detail", Article.getArticleDetail)
    .put("/article/publish", Article.isPubilshArticle)


// blog api

module.exports = router;
