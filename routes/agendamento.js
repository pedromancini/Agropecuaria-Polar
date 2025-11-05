const express = require("express");
const router = express.Router();

// Função middleware para verificar login
function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

router.get("/agendamento", verificarLogin, (req, res) => {
    res.render("agendamento", { usuario: req.session.usuario });
});

module.exports = router;
