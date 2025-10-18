const connection = require("./connection")
const enderecoModel = require("./enderecoModel")
const cidadeModel = require("./cidadeModel")
const Sequelize = require("sequelize")

const usuariosModel = connection.define("USUARIO", {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Cidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: cidadeModel,
            key: "id"
        }
    },
    Imagem: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    idEndereco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: enderecoModel,
            key: "id"
        }
    }
})

// Associação 1 -> 1 - endereço
usuariosModel.belongsTo(enderecoModel, {
    foreignKey: "idEndereco",
    as: "ENDERECO"
})

usuariosModel.sync({force:false})

module.exports = usuariosModel