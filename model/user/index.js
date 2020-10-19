const md5 = require('md5');
const sqlModel = require('../../lib/mysql');
const msg = require('../../lib/responseMsg');
const generateToken = require('../../public/jwt/generateToken');


// 用户登录
const login = async ctx => {
    const body = ctx.request.body;
    const { mobile, password } = body;
    try {
        const [user] = await sqlModel.queryUserWithMobile(mobile);
        if (user) {
            const { password: pwd, ...others } = user;
            if (md5(password) !== pwd) {
                ctx.loginFail({}, msg.LOGIN_PASSWORD_ERROR);
            } else {
                const token = generateToken(user.id);
                ctx.loginSuccess({token, ...others});
            }
        } else {
            ctx.loginFail({}, msg.USER_NOT_EXISTS);
        }
    } catch (error) {
        ctx.loginFail(error ,msg.LOGIN_FAIL);
    }
}

// 用户注册
const regist = async ctx => {
    const body = ctx.request.body;
    const { mobile, password } = body;
    try {
        const [user] = await sqlModel.queryUserWithMobile(mobile);
        if (user) {
            ctx.registFail({}, msg.USER_EXISTS);
        } else {
            try {
                const res = await sqlModel.userRegist({ mobile, password: md5(password) });
                if (res) {
                    ctx.registSuccess();
                }
            } catch (error) {
                ctx.registFail(error, msg.USER_EXISTS);
            }
        }
    } catch (err) {
        ctx.registFail(err, msg.USER_EXISTS);
    }

}

// 用户重置密码

module.exports = {
    login,
    regist
};
