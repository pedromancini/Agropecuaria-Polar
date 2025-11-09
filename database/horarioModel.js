const connection = require("./connection");
const Sequelize = require("sequelize");

const horarioModel = connection.define("HORARIO", {
    DiaSemana: {
        type: Sequelize.ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'),
        allowNull: false
    },
    HorarioInicio: {
        type: Sequelize.STRING(5),
        allowNull: false
    },
    HorarioFim: {
        type: Sequelize.STRING(5),
        allowNull: false
    },
    Ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

horarioModel.sync({ force: false });

module.exports = horarioModel;