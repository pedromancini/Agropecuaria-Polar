const connection = require("./connection");
const Sequelize = require("sequelize");

const produtoModel = connection.define("PRODUTO", {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Valor: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    Descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    DuracaoMinutos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60
    },
    Ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

produtoModel.sync({ force: false });

module.exports = produtoModel;