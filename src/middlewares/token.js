// api校验token
const verifyToken = require("../public/jwt/verifyToken");
const statusCode = require('../lib/statusCode');
const msg = require('../lib/responseMsg');

module.exports = () => async (ctx, next) => {
    // 获取 token
    const token = ctx.header.authorization;
    if (token) {
        try {
            // verify 函数验证 token，并获取用户相关信息
            const result = await verifyToken(token);
            
            if (result && result.data) {
                // 进入下一个中间件
                await next()
            } else {
                ctx.needToken(msg.TOKEN_FIAL);
            }
        } catch (err) {
            ctx.needToken(msg.TOKEN_FIAL);
        }
    } else {
        ctx.needToken(msg.NEED_TOKEN);
    }
}