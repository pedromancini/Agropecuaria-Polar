const connection = require("./connection")
const Sequelize = require("sequelize")
const usuarioModel = require("./usuariosModel")
const petModel = require("./petModel")

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
})

// 1 usuário → N serviços
usuarioModel.hasMany(servicoModel, {
    foreignKey: "IdUsuario",
    as: "SERVICOS"
});
servicoModel.belongsTo(usuarioModel, {
    foreignKey: "IdUsuario",
    as: "USUARIO"
});

// 1 pet → N serviços
petModel.hasMany(servicoModel, {
    foreignKey: "IdPet",
    as: "SERVICOS_PET"
});
servicoModel.belongsTo(petModel, {
    foreignKey: "IdPet",
    as: "PET"
});

servicoModel.sync({force:false});
