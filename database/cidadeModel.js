const connection = require("./connection")
const Sequelize = require("sequelize")

cidadesModel = connection.define("CIDADE", {
    idEnde

})

cidadesModel.sync({force:false})

module.exports = cidadesModel