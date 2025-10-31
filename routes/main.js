const express = require("express");
const router = express.Router();

// Middleware para verificar se o usuário está logado
function verificarLogin(req, res, next) {
  if (!req.session.usuario) {
    // se não tiver logado, redireciona pro login
    return res.redirect("/login");
  }
  next();
}

// Página inicial protegida
router.get("/",(req, res) => {
    res.render("main", { usuario: req.session.usuario });
});

// router.get("/agendamento", verificarLogin, (req, res) => {
//     res.render("agendamento", { usuario: req.session.usuario });
// });


module.exports = router;