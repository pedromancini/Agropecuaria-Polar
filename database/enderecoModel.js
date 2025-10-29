const connection = require("./connection")
const Sequelize = require("sequelize")
const cidadeModel = require("./cidadeModel")
const estadoModel = require("./estadoModel")

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

// Associação 1->1 - Cidade
enderecoModel.belongsTo(cidadeModel, {
    foreignKey: "idCidade",
    key: "id"
})

// Associação 1->1 - Estado
enderecoModel.belongsTo(estadoModel, {
    foreignKey: "IdEstado",
    key: "id"
})

enderecoModel.sync({force:false})

module.exports = enderecoModel