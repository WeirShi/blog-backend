require('./public/utils/time');

const Koa = require("koa");
const logger = require('koa-logger');
const app = new Koa();
const port = require('./config').port;

// 路由配置
const Router = require('koa-router')
const router = new Router();
// 跨域设置
const cors = require('koa2-cors');
// 参数解析
const parser = require('koa-bodyparser');
const routers = require('./routers')
const user = require('./routers/user')

const verifyToken = require('./middlewares/token');
const customResponse = require('./middlewares/customResponse')

// 日志
app.use(logger())
    // 允许跨域
    .use(cors())
    // 接口参数解析
    .use(parser())
    // 自定义response回复
    .use(customResponse())
    // 注册 登录接口 不需要验证token
    .use(user.routes())
    .use(verifyToken())
    .use(routers.routes())
     //解析路由
    .use(router.allowedMethods());



app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})