// const {router} = require("../config")
// const userModel = require("../database/usuariosModel")
// const enderecoModel = require("../database/enderecoModel")

// router.get("/cadastrar", (req, res) => {
//     res.render("cadastro.ejs")
// })

// router.post("/cadastrar", (req, res) => {
//     const {rua, bairro, estado, cidade, cep, numero, nome, cpf, email, senha} = req.body;

//     enderecoModel.create({
//         Rua: rua,
//         Cep: cep,
//         Bairro: bairro,
//         Estado: estado,
//         Cidade: cidade,
//         Numero: numero,
//     }).then(() => {
//         res.redirect("/")
//     }).catch((error) => {
//         console.error("Erro ao cadastrar usuário:", error);
//         res.status(500).send("Erro ao realizar cadastro");
//     })

//     userModel.create({
//         Nome: nome,
//         Cpf: cpf,
//         Email: email,
//         Senha: senha,
//         idEndereco: enderecoModel.id
//     }).then(()=>{
//         res.redirect("/")
//     }).catch((error) => {
//         console.error("erro ao cadastrar usuario: ", error)
//         res.status(500).send("erro ao cadastrar")
//     })
// })

// module.exports = router

const { router } = require("../config");
const userModel = require("../database/usuariosModel");
const enderecoModel = require("../database/enderecoModel");

router.get("/cadastrar", (req, res) => {
    res.render("cadastro.ejs");
});

router.post("/cadastrar", (req, res) => {
    const { rua, bairro, estado, cidade, cep, numero, nome, cpf, email, senha } = req.body;

    enderecoModel.create({
        Rua: rua,
        Cep: cep,
        Bairro: bairro,
        Estado: estado,
        Cidade: cidade,
        Numero: numero,
    })
    .then((novoEndereco) => {
        return userModel.create({
            Nome: nome,
            Cpf: cpf,
            Email: email,
            Senha: senha,
            idEndereco: novoEndereco.id // usa o id gerado pelo Sequelize
        });
    })
    .then(() => {
        res.redirect("/");
    })
    .catch((error) => {
        console.error("Erro ao cadastrar:", error);
        res.status(500).send("Erro ao realizar cadastro");
    });
});

module.exports = router;
