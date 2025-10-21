const connection = require("./connection")
const Sequelize = require("sequelize")
const estadoModel = require("./estadoModel")

cidadesModel = connection.define("CIDADE", {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    IdEstado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: estadoModel,
            key: "id"
        }
    }
})
cidadesModel.sync({force:false})

module.exports = cidadesModel