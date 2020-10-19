const statusCode = require('../lib/statusCode');
const msg = require('../lib/responseMsg');

const R = (code, data, msg) => {
    return { code, data, msg };
}


const loginSuccess = ctx => data => {
    ctx.body = Object.assign({}, R(statusCode.SUCCESS, data, msg.LOGIN_SUCCESS));
}

const loginFail = ctx => (data, msg) => {
    ctx.body = Object.assign({}, R(statusCode.ERROR, data, msg));
}

const registSuccess = ctx => () => {
    ctx.body = Object.assign({}, R(statusCode.SUCCESS, {}, msg.REGIST_SUCCESS));
}
const registFail = ctx => (data, msg) => {
    ctx.body = Object.assign({}, R(statusCode.SUCCESS, data, msg));
}

const needToken = ctx => msg => {
    ctx.body = Object.assign({}, R(statusCode.NEED_TOKEN, {}, msg));
}

const querySuccess = ctx => data => {
    ctx.body = Object.assign({}, R(statusCode.SUCCESS, data, msg.QUERY_SUCCESS));
}
const queryFail = ctx => data => {
    ctx.body = Object.assign({}, R(statusCode.ERROR, data, msg.QUERY_FAIL));
}

const addSuccess = ctx => () => {
    ctx.body = Object.assign({}, R(statusCode.SUCCESS, {}, msg.ADD_SUCCESS))
}
const addFail = ctx => data => {
    ctx.body = Object.assign({}, R(statusCode.ERROR, data, msg.ADD_FAIL))
}

const updateSuccess = ctx => () => {
    ctx.body = Object.assign({}, R(statusCode.SUCCESS, {}, msg.UPDATE_SUCCESS))
}
const updateFail = ctx => data => {
    ctx.body = Object.assign({}, R(statusCode.ERROR, data, msg.UPDATE_FAIL))
}
const deleteSuccess = ctx => () => {
    ctx.body = Object.assign({}, R(statusCode.SUCCESS, {}, msg.DELETE_SUCCESS))
}
const deleteFail = ctx => data => {
    ctx.body = Object.assign({}, R(statusCode.ERROR, data, msg.DELETE_FAIL))
}


module.exports = () => async (ctx, next) => {
    ctx.loginSuccess = loginSuccess(ctx);
    ctx.loginFail = loginFail(ctx);
    ctx.registSuccess = registSuccess(ctx);
    ctx.registFail = registFail(ctx);
    ctx.needToken = needToken(ctx);
    ctx.querySuccess = querySuccess(ctx);
    ctx.queryFail = queryFail(ctx);
    ctx.addSuccess = addSuccess(ctx);
    ctx.addFail = addFail(ctx);
    ctx.updateSuccess = updateSuccess(ctx);
    ctx.updateFail = updateFail(ctx);
    ctx.deleteSuccess = deleteSuccess(ctx);
    ctx.deleteFail = deleteFail(ctx);
    // 进入下一个中间件
    await next();
}