const express = require("express");
const router = express.Router();
const produtoModel = require("../database/produtoModel");
const servicoModel = require("../database/servicoModel");
// const servicoProdutoModel = require("../database/servicoProdutoModel");
const petModel = require("../database/petModel");
const { Op } = require("sequelize");

// Middleware de login
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

        // Buscar o pet selecionado
        const pet = await petModel.findOne({
            where: { 
                id: petId,
                idUsuario: req.session.usuario.id 
            }
        });

        if (!pet) {
            return res.redirect("/agendamento");
        }

        // Buscar produtos (serviços) ativos
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

// Página de agendamento (data e hora)
router.get("/agendar", verificarLogin, async (req, res) => {
    try {
        const { petId, produtoIds } = req.query;

        if (!petId || !produtoIds) {
            return res.redirect("/agendamento");
        }

        const idsArray = produtoIds.split(',').map(id => parseInt(id));

        const pet = await petModel.findOne({
            where: { 
                id: petId,
                idUsuario: req.session.usuario.id 
            }
        });

        const produtos = await produtoModel.findAll({
            where: { id: idsArray }
        });

        if (!pet || produtos.length === 0) {
            return res.redirect("/agendamento");
        }

        // Calcular valor total e duração total
        const valorTotal = produtos.reduce((sum, p) => sum + parseFloat(p.Valor), 0);
        const duracaoTotal = produtos.reduce((sum, p) => sum + p.DuracaoMinutos, 0);

        res.render("agendar", { 
            pet, 
            produtos,
            valorTotal,
            duracaoTotal,
            usuario: req.session.usuario 
        });
    } catch (error) {
        console.error("Erro ao carregar página de agendamento:", error);
        res.status(500).send("Erro ao carregar página");
    }
});

// Processar agendamento
router.post("/agendar", verificarLogin, async (req, res) => {
    try {
        const { petId, produtoIds, data, horario, observacoes, acrescimo, desconto } = req.body;

        // Validações
        if (!petId || !produtoIds || !data || !horario) {
            return res.status(400).json({ 
                erro: "Todos os campos são obrigatórios!" 
            });
        }

        const idsArray = produtoIds.split(',').map(id => parseInt(id));

        // Verificar se o pet pertence ao usuário
        const pet = await petModel.findOne({
            where: { 
                id: petId,
                idUsuario: req.session.usuario.id 
            }
        });

        if (!pet) {
            return res.status(400).json({ 
                erro: "Pet não encontrado!" 
            });
        }

        // Buscar produtos selecionados
        const produtos = await produtoModel.findAll({
            where: { id: idsArray }
        });

        // Calcular valor total
        let valorTotal = produtos.reduce((sum, p) => sum + parseFloat(p.Valor), 0);
        
        if (acrescimo) valorTotal += parseFloat(acrescimo);
        if (desconto) valorTotal -= parseFloat(desconto);

        // Criar data/hora completa
        const dataHora = new Date(`${data}T${horario}`);

        // Verificar se já existe agendamento no mesmo horário (opcional)
        const agendamentoExistente = await servicoModel.findOne({
            where: {
                DataAgendamento: {
                    [Op.between]: [
                        new Date(`${data}T00:00:00`),
                        new Date(`${data}T23:59:59`)
                    ]
                },
                HorarioAgendamento: horario,
                Status: { [Op.in]: ['Pendente', 'Confirmado'] }
            }
        });

        if (agendamentoExistente) {
            return res.status(400).json({ 
                erro: "Já existe um agendamento neste horário. Escolha outro." 
            });
        }

        // Criar agendamento
        const servico = await servicoModel.create({
            idUsuario: req.session.usuario.id,
            idPet: petId,
            DataAgendamento: dataHora,
            HorarioAgendamento: horario,
            ValorTotal: valorTotal,
            Acrescimo: acrescimo || 0,
            Desconto: desconto || 0,
            Observacoes: observacoes || null,
            Status: 'Pendente'
        });

        // Vincular produtos ao serviço
        for (const produtoId of idsArray) {
            await servicoProdutoModel.create({
                idServico: servico.id,
                idProduto: produtoId
            });
        }

        res.json({ 
            sucesso: true, 
            mensagem: "Agendamento realizado com sucesso!",
            servicoId: servico.id
        });
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        res.status(500).json({ erro: "Erro ao criar agendamento" });
    }
});

// Listar meus agendamentos
router.get("/meus-agendamentos", verificarLogin, async (req, res) => {
    try {
        const servicos = await servicoModel.findAll({
            where: { idUsuario: req.session.usuario.id },
            include: [
                {
                    model: petModel,
                    as: "PET"
                },
                {
                    model: produtoModel,
                    as: "PRODUTOS",
                    through: { attributes: [] }
                }
            ],
            order: [['DataAgendamento', 'DESC']]
        });

        res.render("meusAgendamentos", { 
            servicos,
            usuario: req.session.usuario 
        });
    } catch (error) {
        console.error("Erro ao listar agendamentos:", error);
        res.status(500).send("Erro ao listar agendamentos");
    }
});

// Cancelar agendamento
router.post("/agendamento/cancelar/:id", verificarLogin, async (req, res) => {
    try {
        const servico = await servicoModel.findOne({
            where: {
                id: req.params.id,
                idUsuario: req.session.usuario.id
            }
        });

        if (!servico) {
            return res.status(404).json({ erro: "Agendamento não encontrado" });
        }

        if (servico.Status === 'Concluído') {
            return res.status(400).json({ 
                erro: "Não é possível cancelar um agendamento já concluído" 
            });
        }

        await servico.update({ Status: 'Cancelado' });

        res.json({ 
            sucesso: true, 
            mensagem: "Agendamento cancelado com sucesso!" 
        });
    } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        res.status(500).json({ erro: "Erro ao cancelar agendamento" });
    }
});

module.exports = router;