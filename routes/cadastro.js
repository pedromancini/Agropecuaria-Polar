const express = require("express");
const router = express.Router();
const userModel = require("../database/usuariosModel");
const enderecoModel = require("../database/enderecoModel");
const bcrypt = require("bcryptjs");

router.get("/cadastrar", (req, res) => {
    res.render("cadastro.ejs");
});

// POST: recebe formulário e salva no banco
router.post("/cadastrar", async (req, res) => {
  try {
    const { rua, bairro, estado, cidade, cep, numero, nome, cpf, email, telefone, senha } = req.body;

    // Criptografa a senha antes de salvar
    const hash = await bcrypt.hash(senha, 10);

    // Cria endereço primeiro
    const novoEndereco = await enderecoModel.create({
      Rua: rua,
      Cep: cep,
      Bairro: bairro,
      Estado: estado,
      Cidade: cidade,
      Numero: numero,
    });

    // Cria usuario com id do endereço
    await userModel.create({
      Nome: nome,
      Cpf: cpf,
      Email: email,
      Telefone: telefone,
      Senha: hash, // SALVA SENHA CRIPTOGRAFADA
      idEndereco: novoEndereco.id,
    });

    res.redirect("/login"); // redireciona para login após cadastro
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    res.status(500).send("Erro ao realizar cadastro");
  }
});

module.exports = router;
