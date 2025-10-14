const Sequelize = require("sequelize")

const connection = new Sequelize("agropec_polar", "root", "1234", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection