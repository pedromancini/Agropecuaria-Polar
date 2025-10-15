const {router} = require("../config")
const userModel = require("../database/usuariosModel")

router.get("/cadastrar", (req, res) => {
    res.render("cadastro.ejs")
})

router.post("/cadastrar", (req, res) => {
    const {nome, cpf, email, cep, rua, numero, bairro, cidade, estado, senha, senha_confirmacao} = req.body;

    // Validar se as senhas tao certinha
    if (senha !== senha_confirmacao) {
        return res.status(400).send("As senhas não coincidem!");
    }

    // Montar o endereço completo
    const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade}/${estado} - CEP: ${cep}`;

    userModel.create({
        nome: nome,
        email: email,
        senha: senha,
        endereco: enderecoCompleto,
        cpf: cpf
    }).then(() => {
        res.redirect("/")
    }).catch((error) => {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).send("Erro ao realizar cadastro");
    })
})

module.exports = router