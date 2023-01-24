// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { name } = require("./package.json")

// eslint-disable-next-line no-undef
module.exports = {
    apps: [{
        name: name,
        script: "./dist/index.js",
    }],

    log: {
        time: true,
    },
}