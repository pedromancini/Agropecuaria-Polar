const express = require("express");
const router = express.Router();
const produtoModel = require("../database/produtoModel");
const usuariosModel = require("../database/usuariosModel");

async function verificarAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }

    // Atualiza os dados do usuário a partir do banco
    const usuarioAtualizado = await usuariosModel.findByPk(req.session.usuario.id);

    if (!usuarioAtualizado) {
        req.session.destroy();
        return res.redirect("/login");
    }

    // Atualiza sessão
    req.session.usuario = usuarioAtualizado;

    // Verifica tipo
    if (usuarioAtualizado.TipoUsuario !== 'Admin') {
        return res.status(403).send("Acesso negado! Apenas administradores podem acessar esta área.");
    }

    next();
}


// dashboard adm
router.get("/admin", verificarAdmin, async (req, res) => {
    try {
        const produtos = await produtoModel.findAll({
            order: [['Nome', 'ASC']]
        });

        res.render("admin/dashboard", { 
            produtos,
            usuario: req.session.usuario 
        });
    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        res.status(500).send("Erro ao carregar painel");
    }
});

// criar servico
router.get("/admin/servicos/novo", verificarAdmin, (req, res) => {
    res.render("admin/novoServico", { 
        usuario: req.session.usuario 
    });
});

router.post("/admin/servicos/criar", verificarAdmin, async (req, res) => {
    try {
        const { nome, valor, descricao, duracaoMinutos, ativo } = req.body;

        // Validações
        if (!nome || !valor || !descricao || !duracaoMinutos) {
            return res.status(400).json({ 
                erro: "Preencha todos os campos obrigatórios!" 
            });
        }

        const produto = await produtoModel.create({
            Nome: nome,
            Valor: parseFloat(valor),
            Descricao: descricao,
            DuracaoMinutos: parseInt(duracaoMinutos),
            Ativo: ativo === 'true' || ativo === true
        });

        res.json({ 
            sucesso: true, 
            mensagem: "Serviço criado com sucesso!",
            produto 
        });
    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        res.status(500).json({ erro: "Erro ao criar serviço" });
    }
});

// edit servico
router.get("/admin/servicos/editar/:id", verificarAdmin, async (req, res) => {
    try {
        const produto = await produtoModel.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).send("Serviço não encontrado");
        }

        res.render("admin/editarServico", { 
            produto,
            usuario: req.session.usuario 
        });
    } catch (error) {
        console.error("Erro ao carregar serviço:", error);
        res.status(500).send("Erro ao carregar serviço");
    }
});

router.post("/admin/servicos/atualizar/:id", verificarAdmin, async (req, res) => {
    try {
        const { nome, valor, descricao, duracaoMinutos, ativo } = req.body;

        const produto = await produtoModel.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).json({ erro: "Serviço não encontrado" });
        }

        await produto.update({
            Nome: nome,
            Valor: parseFloat(valor),
            Descricao: descricao,
            DuracaoMinutos: parseInt(duracaoMinutos),
            Ativo: ativo === 'true' || ativo === true
        });

        res.json({ 
            sucesso: true, 
            mensagem: "Serviço atualizado com sucesso!" 
        });
    } catch (error) {
        console.error("Erro ao atualizar serviço:", error);
        res.status(500).json({ erro: "Erro ao atualizar serviço" });
    }
});

// ativar / desativar servico
router.post("/admin/servicos/toggle/:id", verificarAdmin, async (req, res) => {
    try {
        const produto = await produtoModel.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).json({ erro: "Serviço não encontrado" });
        }

        await produto.update({ Ativo: !produto.Ativo });

        res.json({ 
            sucesso: true, 
            mensagem: `Serviço ${produto.Ativo ? 'ativado' : 'desativado'} com sucesso!`,
            ativo: produto.Ativo
        });
    } catch (error) {
        console.error("Erro ao alterar status:", error);
        res.status(500).json({ erro: "Erro ao alterar status" });
    }
});

// exclluir servico
router.delete("/admin/servicos/excluir/:id", verificarAdmin, async (req, res) => {
    try {
        const produto = await produtoModel.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).json({ erro: "Serviço não encontrado" });
        }

        // Verificar se o serviço está sendo usado em algum agendamento
        const servicoProduto = require("../database/servicoProduto");
        
        const emUso = await servicoProduto.findOne({
            where: { idProduto: req.params.id }
        });

        if (emUso) {
            return res.status(400).json({ 
                erro: "Este serviço não pode ser excluído pois está sendo usado em agendamentos. Você pode desativá-lo." 
            });
        }

        await produto.destroy();

        res.json({ 
            sucesso: true, 
            mensagem: "Serviço excluído com sucesso!" 
        });
    } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        res.status(500).json({ erro: "Erro ao excluir serviço" });
    }
});

module.exports = router;