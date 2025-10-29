const connection = require("./connection")
const Sequelize = require("sequelize")
const usuarioModel = require("./usuariosModel")

const servicoModel = connection.define("SERVICO", {
    DataAgendamento: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    ValorTotal: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    Acrescimo: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    Desconto: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    IdProduto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: produtoModel,
            key: "id"
        },
    },
    IdUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: usuarioModel,
            key: "id"
        },
    },
})

