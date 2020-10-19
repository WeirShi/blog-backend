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


app.use(logger());
// 允许跨域
app.use(cors());
// 接口参数解析
app.use(parser());
// 自定义response回复
app.use(customResponse());
// 注册 登录接口 不需要验证token
app.use(user.routes());
app.use(verifyToken()).use(routers.routes());
app.use(router.allowedMethods()); //解析路由



app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})