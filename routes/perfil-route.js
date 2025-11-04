const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Sequelize = require('sequelize');
const usuariosModel = require("../database/usuariosModel");
const enderecoModel = require("../database/enderecoModel");

// Middleware para verificar login
function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

// Página de perfil (GET)
router.get("/perfil", verificarLogin, async (req, res) => {
    try {
        const usuario = await usuariosModel.findByPk(req.session.usuario.id, {
            include: [{
                model: enderecoModel,
                as: "ENDERECO"
            }]
        });
        
        if (!usuario) {
            return res.redirect("/login");
        }

        res.render("perfil", { usuario });
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        res.status(500).send("Erro ao carregar perfil");
    }
});

// Atualizar informações pessoais (POST)
router.post("/perfil/atualizar-dados", verificarLogin, async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        
        // Verificar se o email não está em uso por outro usuário
        const emailExistente = await usuariosModel.findOne({
            where: { 
                Email: email,
                id: { [Sequelize.Op.ne]: req.session.usuario.id } // diferente do id atual
            }
        });

        if (emailExistente) {
            return res.status(400).json({ erro: "Email já está em uso!" });
        }

        await usuariosModel.update(
            { 
                Nome: nome, 
                Email: email, 
                Telefone: telefone 
            },
            { where: { id: req.session.usuario.id } }
        );

        // Atualizar sessão
        req.session.usuario.nome = nome;
        req.session.usuario.email = email;

        res.json({ sucesso: true, mensagem: "Dados atualizados com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        res.status(500).json({ erro: "Erro ao atualizar dados" });
    }
});

// Atualizar endereço (POST)
router.post("/perfil/atualizar-endereco", verificarLogin, async (req, res) => {
    try {
        const { cep, rua, numero, bairro, cidade, estado } = req.body;
        
        // Buscar o usuário para pegar o idEndereco
        const usuario = await usuariosModel.findByPk(req.session.usuario.id);

        // Atualizar o endereço
        await enderecoModel.update(
            { 
                Cep: cep, 
                Rua: rua, 
                Numero: numero, 
                Bairro: bairro, 
                Cidade: cidade, 
                Estado: estado 
            },
            { where: { id: usuario.idEndereco } }
        );

        res.json({ sucesso: true, mensagem: "Endereço atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar endereço:", error);
        res.status(500).json({ erro: "Erro ao atualizar endereço" });
    }
});

// Alterar senha (POST)
router.post("/perfil/alterar-senha", verificarLogin, async (req, res) => {
    try {
        const { senhaAtual, novaSenha, confirmarSenha } = req.body;

        // Validações
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            return res.status(400).json({ erro: "Preencha todos os campos!" });
        }

        if (novaSenha !== confirmarSenha) {
            return res.status(400).json({ erro: "As senhas não coincidem!" });
        }

        if (novaSenha.length < 6) {
            return res.status(400).json({ erro: "A senha deve ter no mínimo 6 caracteres!" });
        }

        // Buscar usuário
        const usuario = await usuariosModel.findByPk(req.session.usuario.id);

        // Verificar senha atual
        const senhaValida = await bcrypt.compare(senhaAtual, usuario.Senha);
        if (!senhaValida) {
            return res.status(400).json({ erro: "Senha atual incorreta!" });
        }

        // Hash da nova senha
        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualizar senha
        await usuariosModel.update(
            { Senha: novaSenhaHash },
            { where: { id: req.session.usuario.id } }
        );

        res.json({ sucesso: true, mensagem: "Senha alterada com sucesso!" });
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        res.status(500).json({ erro: "Erro ao alterar senha" });
    }
});

// FINALIZAR!!!! ( MULTER ->  TESTAR )
router.post("/perfil/atualizar-foto", verificarLogin, async (req, res) => {
    try {
        const { imagemBase64 } = req.body;
        
        await usuariosModel.update(
            { Imagem: imagemBase64 },
            { where: { id: req.session.usuario.id } }
        );

        res.json({ sucesso: true, mensagem: "Foto atualizada com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        res.status(500).json({ erro: "Erro ao atualizar foto" });
    }
});

module.exports = router;