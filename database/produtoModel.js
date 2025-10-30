const connection = require("./connection")
const Sequelize = require("sequelize")

const produtoModel = connection.define("PRODUTO", {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Valor: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    Descricao:{
        type: Sequelize.TEXT,
        allowNull:false,
    }
})

produtoModel.sync({force: false})