const connection = require("./connection");
const Sequelize = require("sequelize");
const usuarioModel = require("./usuariosModel");
const petModel = require("./petModel");

const servicoModel = connection.define("SERVICO", {
    DataAgendamento: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    HorarioAgendamento: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    ValorTotal: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    Acrescimo: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
    },
    Desconto: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
    },
    Status: {
        type: Sequelize.ENUM('Pendente', 'Confirmado', 'Concluído', 'Cancelado'),
        allowNull: false,
        defaultValue: 'Pendente'
    },
    Observacoes: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: usuarioModel,
            key: "id"
        },
    },
    idPet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: petModel,
            key: "id"
        },
    },
});

// 1 usuário → N serviços
usuarioModel.hasMany(servicoModel, {
    foreignKey: "idUsuario",
    as: "SERVICOS"
});
servicoModel.belongsTo(usuarioModel, {
    foreignKey: "idUsuario",
    as: "USUARIO"
});

// 1 pet → N serviços
petModel.hasMany(servicoModel, {
    foreignKey: "idPet",
    as: "SERVICOS_PET"
});
servicoModel.belongsTo(petModel, {
    foreignKey: "idPet",
    as: "PETs"
});

servicoModel.sync({ force: false });

module.exports = servicoModel;