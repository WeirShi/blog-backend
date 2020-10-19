const Koa = require("koa");
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
// const user = require('./model/user');
const verifyToken = require('./middlewares/token');
const customResponse = require('./middlewares/customResponse')


// 允许跨域
app.use(cors());
app.use(parser());
app.use(customResponse());

// app.use(verifyToken());
app.use(user.routes());
app.use(verifyToken()).use(routers.routes())
// console.log(routers.routes);
app.use(router.allowedMethods()) //解析路由



app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})