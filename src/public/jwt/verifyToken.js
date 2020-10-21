const JWT = require("jsonwebtoken");
const config = require("./config");

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const res = JWT.verify(token, config.PRIVATE_KEY);
            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = verifyToken;
