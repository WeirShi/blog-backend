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
// verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoxLCJpYXQiOjE2MDMwMDgxOTgsImV4cCI6MTYwMzI2NzM5OH0.Gy8zdERK1q3PPj0EZGGTfhe8TMANj3DhcJ3y1v2hQx0');
