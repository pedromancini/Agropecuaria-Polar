const connection = require("./connection")
const Sequelize = require("sequelize")
const produtoModel = require("./produtoModel")
const servicoModel = require("./servicoModel")

const servicoProduto = connection.define("SERVICOPRODUTO", {
    idServico: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: servicoModel,
            key: "id"
        }
    },
    idProduto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: produtoModel,
            allowNull: false
        },
    }
})

// Relação N:N → através de SERVICOPRODUTO
servicoModel.belongsToMany(produtoModel, {
    through: servicoProduto,
    foreignKey: "idServico",
    as: "PRODUTOS"
});

produtoModel.belongsToMany(servicoModel, {
    through: servicoProduto,
    foreignKey: "idProduto",
    as: "SERVICOS"
});

servicoProduto.sync({force:false})

module.exports = servicoProduto