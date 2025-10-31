const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const userModel = require("../database/usuariosModel");

// GET: página de login
router.get("/login", (req, res) => {
  res.render("login", { mensagem: null, sucesso: null });
});

// POST: processa login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await userModel.findOne({ where: { Email: email } });

    if (!usuario) {
      return res.render("login", {
        mensagem: "Login inválido<br>Email ou senha incorreto!",
        sucesso: false,
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.Senha);
    if (!senhaValida) {
      return res.render("login", {
        mensagem: "Login inválido<br>Email ou senha incorreto!",
        sucesso: false,
      });
    }

    // Salva dados do usuário na sessão
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.Nome,
      email: usuario.Email,
    };

    return res.render("login", { mensagem: "Login válido ✅", sucesso: true });
  } catch (err) {
    console.error(err);
    res.render("login", { mensagem: "Erro no servidor", sucesso: false });
  }
});

// GET: logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Erro ao sair");
    res.redirect("/");
  });
});

module.exports = router;
