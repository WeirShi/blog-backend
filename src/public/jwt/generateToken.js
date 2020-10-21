const JWT = require("jsonwebtoken");
const config = require("./config");

const generateToken = (userId) => {
    const token = JWT.sign({
        data: userId
    }, config.PRIVATE_KEY, {
        expiresIn: config.EXPIRESD
    });
    return token;
}

module.exports = generateToken;

