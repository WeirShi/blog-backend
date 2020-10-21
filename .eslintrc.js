module.exports = {
    root: true,
    env: {
        node: true,
        commonjs: true
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module"
    },    
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
    }
}
