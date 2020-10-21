const config = {
    port: 9000,
    database: {
        HOST: "localhost",
        USER: "root",
        PORT: 3306,
        PASSWORD:"loveMCY1314",
        DATABASE: process.env.NODE_ENV === "development" ? "blogdev" : "blog"
    }
};

module.exports = config;
