const connection = require("./connection")
const Sequelize = require("sequelize")

const estadoModel = connection.define("ESTADO", {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

estadoModel.sync({force:false})

module.exports = estadoModel