const connection = require("./connection")
const usuarioModel = require("./usuariosModel")
const Sequelize = require("sequelize")

const petModel = connection.define("PET", {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Tipo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Sexo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Idade: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    Porte: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: usuarioModel,
            key: "id"
        }
    }
})

// Cada pet pertence a um usuário
petModel.belongsTo(usuarioModel, {
    foreignKey: "idUsuario",
    as: "USUARIO"
})

petModel.sync({force:false})

module.exports = petModel