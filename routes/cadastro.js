const {router} = require("../config")
const userModel = require("../database/usuariosModel")

router.get("/cadastrar", (req, res) => {
    res.render("cadastro.ejs")
})

router.post("/cadastrar", (req, res) => {
    const {nome, endereco, cpf, email, senha} = req.body;

    userModel.create({
        nome: nome,
        email: email,
        senha: senha,
        endereco: endereco,
        cpf: cpf
    }).then(() => {
        res.redirect("/")
    })
})

module.exports = router
