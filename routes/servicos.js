const express = require("express");
const router = express.Router();
const produtoModel = require("../database/produtoModel");
const petModel = require("../database/petModel");

function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

// Página de seleção de serviços
router.get("/servicos", verificarLogin, async (req, res) => {
    try {
        const petId = req.query.petId;

        if (!petId) {
            return res.redirect("/agendamento");
        }

        const pet = await petModel.findOne({
            where: { 
                id: petId,
                idUsuario: req.session.usuario.id 
            }
        });

        if (!pet) {
            return res.redirect("/agendamento");
        }

        const produtos = await produtoModel.findAll({
            where: { Ativo: true },
            order: [['Nome', 'ASC']]
        });

        res.render("servicos", { 
            pet, 
            produtos,
            usuario: req.session.usuario 
        });
    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        res.status(500).send("Erro ao carregar serviços");
    }
});

module.exports = router;