const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const usuariosModel = require("../database/usuariosModel");
const enderecoModel = require("../database/enderecoModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Diretório de uploads das imagens de perfil
const uploadDir = "public/uploads/perfil/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware de login
function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

// Configuração do Multer para perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // até 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Erro: Apenas imagens são permitidas!"));
        }
    },
});


// Página de perfil
router.get("/perfil", verificarLogin, async (req, res) => {
    try {
        const usuario = await usuariosModel.findByPk(req.session.usuario.id, {
            include: [{ model: enderecoModel, as: "ENDERECO" }],
        });

        if (!usuario) return res.redirect("/login");

        res.render("perfil", { usuario });
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        res.status(500).send("Erro ao carregar perfil");
    }
});

router.post("/perfil/atualizar-dados", verificarLogin, async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;

        const emailExistente = await usuariosModel.findOne({
            where: {
                Email: email,
                id: { [Sequelize.Op.ne]: req.session.usuario.id },
            },
        });

        if (emailExistente) {
            return res.status(400).json({ erro: "Email já está em uso!" });
        }

        await usuariosModel.update(
            { Nome: nome, Email: email, Telefone: telefone },
            { where: { id: req.session.usuario.id } }
        );

        req.session.usuario.Nome = nome;
        req.session.usuario.Email = email;
        req.session.usuario.Telefone = telefone;

        res.json({ sucesso: true, mensagem: "Dados atualizados com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        res.status(500).json({ erro: "Erro ao atualizar dados" });
    }
});

// Atualizar endereço
router.post("/perfil/atualizar-endereco", verificarLogin, async (req, res) => {
    try {
        const { cep, rua, numero, bairro, cidade, estado } = req.body;
        const usuario = await usuariosModel.findByPk(req.session.usuario.id);

        if (!usuario || !usuario.idEndereco) {
            return res.status(400).json({ erro: "Endereço não encontrado!" });
        }

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

// Alterar senha
router.post("/perfil/alterar-senha", verificarLogin, async (req, res) => {
    try {
        const { senhaAtual, novaSenha, confirmarSenha } = req.body;

        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            return res.status(400).json({ erro: "Preencha todos os campos!" });
        }

        if (novaSenha !== confirmarSenha) {
            return res.status(400).json({ erro: "As senhas não coincidem!" });
        }

        if (novaSenha.length < 6) {
            return res.status(400).json({ erro: "A senha deve ter no mínimo 6 caracteres!" });
        }

        const usuario = await usuariosModel.findByPk(req.session.usuario.id);

        const senhaValida = await bcrypt.compare(senhaAtual, usuario.Senha);
        if (!senhaValida) {
            return res.status(400).json({ erro: "Senha atual incorreta!" });
        }

        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

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

// Atualizar foto de perfil
router.post(
    "/perfil/atualizar-foto",
    verificarLogin,
    upload.single("foto"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ erro: "Nenhuma imagem enviada!" });
            }

            // Busca o usuário para deletar a foto antiga
            const usuario = await usuariosModel.findByPk(req.session.usuario.id);

            // Remove a foto antiga se existir
            if (usuario.Imagem) {
                const oldPhotoPath = path.join(__dirname, "..", uploadDir, path.basename(usuario.Imagem));
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }

            const caminhoImagem = req.file.filename;

            await usuariosModel.update(
                { Imagem: caminhoImagem },
                { where: { id: req.session.usuario.id } }
            );

            req.session.usuario.Imagem = caminhoImagem;

            res.json({ 
                sucesso: true, 
                mensagem: "Foto de perfil atualizada!",
                novaImagem: caminhoImagem
            });
        } catch (error) {
            console.error("Erro ao atualizar foto:", error);
            
            // Remove o arquivo se houver erro
            if (req.file) {
                const filePath = path.join(__dirname, "..", uploadDir, req.file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            
            res.status(500).json({ erro: "Erro ao atualizar foto" });
        }
    }
);

module.exports = router;