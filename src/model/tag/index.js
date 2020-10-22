const sqlModel = require('../../lib/mysql');

/**
 * 获取分类列表
 * @date 2020-10-14
 */
const getTagList = async ctx => {
    const query = ctx.request.query;
    try {
        const [{ total }] = await sqlModel.getTagTotal();
        const list = await sqlModel.getTagList(query);
        ctx.querySuccess({
            total,
            list
        });
    } catch (error) {
        ctx.queryFail(error);
    }
}

const addTag = async ctx => {
    const body = ctx.request.body;
    try {
        const res = await sqlModel.addTag(body);
        if (res) {
            ctx.addSuccess();
        }
    } catch (error) {
        ctx.addFail(error);
    }
}

const deleteTag = async ctx => {
    const query = ctx.request.query;
    try {
        const res = await sqlModel.deleteTag(query);
        if (res) {
            ctx.deleteSuccess();
        }
    } catch (error) {
        ctx.deleteFail(error);
    }
}

const updateTag = async ctx => {
    const body = ctx.request.body;
    try {
        const res = await sqlModel.updateTag(body);
        if (res) {
            ctx.updateSuccess();
        }
    } catch (error) {
        ctx.updateFail(error);
    }
    
}
module.exports = {
    getTagList,
    addTag,
    deleteTag,
    updateTag
}
