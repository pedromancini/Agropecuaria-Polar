const connection = require("./connection")
const Sequelize = require("sequelize")

const usuariosModel = connection.define("usuarios", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    endereco: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
})

usuariosModel.sync({force:false})

module.exports = usuariosModel