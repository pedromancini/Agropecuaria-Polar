const {router} = require("../config")
const userModel = require("../database/usuariosModel")
const enderecoModel = require("../database/enderecoModel")

router.get("/cadastrar", (req, res) => {
    res.render("cadastro.ejs")
})

router.post("/cadastrar", (req, res) => {
    const {rua, bairro, estado, cidade, numero, nome, cpf, cep, email, senha} = req.body;

    // Montar o endereço completo
    const enderecoCompleto = `${rua}, ${numero} - ${bairro}`;

    enderecoModel.create({
        Endereco: enderecoCompleto,
        Cpf: cpf,
        Cep: cep,
        Uf: estado,
        Cidade: cidade,
    }).then(() => {
        res.redirect("/")
    }).catch((error) => {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).send("Erro ao realizar cadastro");
    })
})

module.exports = router