const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const petModel = require("../database/petModel");

// Middleware de login
function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

// Diretório de uploads das imagens dos pets
const uploadDirPets = "public/uploads/pets/";
if (!fs.existsSync(uploadDirPets)) {
    fs.mkdirSync(uploadDirPets, { recursive: true });
}

// Configuração do Multer para pets
const storagePets = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirPets);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const uploadPet = multer({
    storage: storagePets,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Apenas imagens são permitidas!"));
        }
    },
});

// ROTAS

// API para buscar pets do usuário (para o modal)
router.get("/api/meus-pets", verificarLogin, async (req, res) => {
    try {
        const pets = await petModel.findAll({
            where: { idUsuario: req.session.usuario.id },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'Nome', 'Tipo', 'Sexo', 'Idade', 'Porte', 'Imagem']
        });

        res.json({ sucesso: true, pets });
    } catch (error) {
        console.error("Erro ao buscar pets:", error);
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar pets" });
    }
});

// Listar pets do usuário
router.get("/pets", verificarLogin, async (req, res) => {
    try {
        const pets = await petModel.findAll({
            where: { idUsuario: req.session.usuario.id },
            order: [['createdAt', 'DESC']]
        });

        res.render("pets", { pets, usuario: req.session.usuario });
    } catch (error) {
        console.error("Erro ao buscar pets:", error);
        res.status(500).send("Erro ao buscar pets");
    }
});

// Página de cadastro de pet
router.get("/cadastrarPet", verificarLogin, (req, res) => {
    res.render("cadastraPet", { usuario: req.session.usuario });
});

// Processar cadastro do pet
router.post(
    "/cadastrarPet",
    verificarLogin,
    uploadPet.single("Imagem"),
    async (req, res) => {
        try {
            const { Nome, Tipo, Sexo, Idade, Porte } = req.body;

            // Validações
            if (!Nome || !Tipo || !Sexo || !Idade || !Porte) {
                if (req.file) {
                    fs.unlinkSync(path.join(uploadDirPets, req.file.filename));
                }
                return res.status(400).send("Todos os campos são obrigatórios!");
            }

            // Caminho da imagem
            let caminhoImagem = null;
            if (req.file) {
                caminhoImagem = req.file.filename;
            }

            // Criar pet no banco
            await petModel.create({
                Nome: Nome,
                Tipo: Tipo,
                Sexo: Sexo,
                Idade: parseInt(Idade),
                Porte: Porte,
                Imagem: caminhoImagem,
                idUsuario: req.session.usuario.id
            });

            res.redirect("/pets");
        } catch (error) {
            console.error("Erro ao cadastrar pet:", error);
            
            // Remove o arquivo se houver erro
            if (req.file) {
                const filePath = path.join(uploadDirPets, req.file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            
            res.status(500).send("Erro ao cadastrar pet. Tente novamente.");
        }
    }
);

// Deletar pet
router.post("/pets/deletar/:id", verificarLogin, async (req, res) => {
    try {
        const pet = await petModel.findOne({
            where: {
                id: req.params.id,
                idUsuario: req.session.usuario.id
            }
        });

        if (!pet) {
            return res.status(404).send("Pet não encontrado");
        }

        // Remove a imagem se existir
        if (pet.Imagem) {
            const imagePath = path.join(uploadDirPets, pet.Imagem);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await pet.destroy();
        res.redirect("/pets");
    } catch (error) {
        console.error("Erro ao deletar pet:", error);
        res.status(500).send("Erro ao deletar pet");
    }
});

module.exports = router;