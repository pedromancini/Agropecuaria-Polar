const connection = require("./connection")
const Sequelize = require("sequelize")
const produtoModel = require("./produtoModel")
const servicoModel = require("./servicoModel")

const servicoProdutoModel = connection.define("SERVICOPRODUTO", {
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
    through: servicoProdutoModel,
    foreignKey: "idServico",
    as: "PRODUTOS"
});

produtoModel.belongsToMany(servicoModel, {
    through: servicoProdutoModel,
    foreignKey: "idProduto",
    as: "SERVICOS"
});

servicoProdutoModel.sync({force:false})

module.exports = servicoProdutoModel