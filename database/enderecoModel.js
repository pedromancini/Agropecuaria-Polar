const connection = require("./connection")
const Sequelize = require("sequelize")

const enderecoModel = connection.define("ENDERECO", {
    Rua: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    Numero: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Bairro: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Cep: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Estado: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Cidade: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

enderecoModel.sync({force:false})

module.exports = enderecoModel