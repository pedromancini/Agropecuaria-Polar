const connection = require("./connection")
const enderecoModel = require("./enderecoModel")
const Sequelize = require("sequelize")

const usuariosModel = connection.define("USUARIO", {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Cpf: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Telefone: {
        type: Sequelize.STRING,
        allowNull: true, // trocar para false
    },
    Senha: {
        type: Sequelize.STRING,
        allowNull: false
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
    },
})

// Associação 1 -> 1 - endereço
usuariosModel.belongsTo(enderecoModel, {
    foreignKey: "idEndereco",
    as: "ENDERECO" // nome da relação
})

usuariosModel.sync({force:false})

module.exports = usuariosModel