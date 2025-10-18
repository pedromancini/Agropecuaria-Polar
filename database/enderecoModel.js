const connection = require("./connection")
const Sequelize = require("sequelize")
const cidadeModel = require("./cidadeModel")

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
    IdEstado: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    IdCidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: cidadeModel,
            key: "id"
        }
    }
})

// Associação 1->1 - Cidade
enderecoModel.belongsTo(cidadeModel, {
    foreignKey: "idCidade",
    key: "id"
})

enderecoModel.sync({force:false})

module.exports = enderecoModel