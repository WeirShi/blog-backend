const sqlModel = require('../../lib/mysql');
const statusCode = require('../../lib/statusCode');
const msg = require('../../lib/responseMsg');

const handleTagAndCategory = (tags, categories) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tagList = await tags.split(",")
                                .reduce( async (prevTagTask, tagId ) => {
                                    let tagList = prevTagTask && await prevTagTask;
                                    const [ tagDetail ] = await sqlModel.getTagDetail(tagId);
                                    tagList.push(tagDetail);
                                    return tagList;
                                }, []);
            const categoryList = await categories.split(",")
                                .reduce( async (prevCategoryTask, categoryId ) => {
                                    let categoryList = prevCategoryTask && await prevCategoryTask;
                                    const [ categoryDetail ] = await sqlModel.getCategoryDetail(categoryId);
                                    categoryList.push(categoryDetail);
                                    return categoryList;
                                }, []);
            resolve({
                tagList,
                categoryList
            });
        } catch (error) {
            reject(error);
        }
    });
}


// 文章列表
const getArticleList = async ctx => {
    const query = ctx.request.query;
    console.log("query", query);
    try {
        const [ {total} ] = await sqlModel.getArticleTotal(query.type);
        const list = await sqlModel.getArticleList(query);
        const newlist = await list.reduce( async (prevTask, item ) => {
                                    const { tags, categories, ...others } = item;
                                    let array = prevTask && await prevTask;
                                    const { tagList, categoryList } = await handleTagAndCategory(tags, categories);
                                    array.push({ ...others, tagList, categoryList  });
                                    return array;
                                }, []);
        ctx.querySuccess({
            total,
            list: newlist
        });
    } catch (error) {
        ctx.queryFail(error);
    }
}

// 新增文章
const addArticle = async (ctx, next) => {
    const body = ctx.request.body;
    try {
        const res = await sqlModel.addArticle(body);
        if (res) {
            ctx.addSuccess();
        }
    } catch (error) {
        ctx.addFail(error);
    }
    
}

// 文章详情
const getArticleDetail = async (ctx, next) => {
    const query = ctx.request.query;
    try {
        const res = await sqlModel.getArticleDetail(query);
        if (res) {
            const [
                {
                    tags,
                    categories,
                    ...others
                }
            ] = res;
            
            const { tagList, categoryList } = await handleTagAndCategory(tags, categories);
            ctx.querySuccess({
                ...others,
                tagList,
                categoryList
            });
        }
    } catch (error) {
        ctx.queryFail(error);
    }
}

// 发布 or 取消发布文章
const isPubilshArticle = async (ctx) => {
    const body = ctx.request.body;
    try {
        const res = await sqlModel.isPublishArticle(body);
        if (res) {
            ctx.updateSuccess();
        }
    } catch (error) {
        ctx.updateFail(error);
    }
}

// 删除文章
const deleteArticle = async ctx => {
    const body = ctx.request.body;
    try {
        const res = await sqlModel.deleteArticle(body);
        if (res) {
            ctx.deleteSuccess();
        }
    } catch (error) {
        ctx.deleteFail(error);
    }
}

// 移动文章到草稿箱
const addArticleToDrafts = async ctx => {
    const query = ctx.request.query;
    try {
        const res = await sqlModel.addArticleToDrafts(query);
        if (res) {
            ctx.updateSuccess();
        }
    } catch (error) {
        ctx.updateFail(error);
    }
}

// 移动文章到列表
const addArticleToList = async ctx => {
    const query = ctx.request.query;
    try {
        const res = await sqlModel.addArticleToList(query);
        if (res) {
            ctx.updateSuccess();
        }
    } catch (error) {
        ctx.updateFail(error);
    }
}

module.exports = {
    getArticleList,
    addArticle,
    getArticleDetail,
    isPubilshArticle,
    deleteArticle,
    addArticleToDrafts,
    addArticleToList
};
