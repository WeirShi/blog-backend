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

// generateToken(1);

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoxLCJpYXQiOjE2MDMwMDgxOTgsImV4cCI6MTYwMzI2NzM5OH0.Gy8zdERK1q3PPj0EZGGTfhe8TMANj3DhcJ3y1v2hQx0

module.exports = generateToken;

