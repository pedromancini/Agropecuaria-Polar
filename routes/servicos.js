const express = require("express");
const router = express.Router();
const produtoModel = require("../database/produtoModel");
const servicoModel = require("../database/servicoModel");
const servicoProdutoModel = require("../database/servicoProduto");
const petModel = require("../database/petModel");
const horarioModel = require("../database/horarioModel");
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

// Página de finalizar agendamento - NOVO!
router.get("/finalizar-agendamento", verificarLogin, async (req, res) => {
    try {
        const { petId, servicos } = req.query;

        if (!petId || !servicos) {
            return res.redirect("/agendamento");
        }

        const idsArray = servicos.split(',').map(id => parseInt(id));

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

        const valorTotal = produtos.reduce((sum, p) => sum + parseFloat(p.Valor), 0);
        const duracaoTotal = produtos.reduce((sum, p) => sum + p.DuracaoMinutos, 0);

        res.render("finalizar-agendamento", { 
            pet, 
            servicos: produtos,
            valorTotal,
            duracaoTotal,
            usuario: req.session.usuario 
        });
    } catch (error) {
        console.error("Erro ao carregar página de agendamento:", error);
        res.status(500).send("Erro ao carregar página");
    }
});

// API: Buscar horários disponíveis - NOVO!
router.get("/api/horarios-disponiveis", verificarLogin, async (req, res) => {
    try {
        const { data, duracao } = req.query;
        
        const dataSelecionada = new Date(data + 'T00:00:00');
        const diaSemana = dataSelecionada.getDay();
        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const diaStr = diasSemana[diaSemana];

        const horariosConfig = await horarioModel.findAll({
            where: { 
                DiaSemana: diaStr,
                Ativo: true 
            },
            order: [['HorarioInicio', 'ASC']]
        });

        if (horariosConfig.length === 0) {
            return res.json([]);
        }

        const agendamentosExistentes = await servicoModel.findAll({
            where: {
                DataAgendamento: {
                    [Op.between]: [
                        new Date(`${data}T00:00:00`),
                        new Date(`${data}T23:59:59`)
                    ]
                },
                Status: { [Op.notIn]: ['Cancelado'] }
            }
        });

        const horariosDisponiveis = [];
        const duracaoMinutos = parseInt(duracao);

        for (const config of horariosConfig) {
            let horaAtual = parseHorario(config.HorarioInicio);
            const horaFim = parseHorario(config.HorarioFim);

            while (horaAtual < horaFim) {
                const horarioStr = formatarHorario(horaAtual);
                const horaFimAtendimento = horaAtual + duracaoMinutos;

                if (horaFimAtendimento > horaFim) break;

                const ocupado = agendamentosExistentes.some(agendamento => {
                    const agendHoraInicio = parseHorario(agendamento.HorarioAgendamento);
                    const agendDuracao = 60;
                    const agendHoraFim = agendHoraInicio + agendDuracao;
                    return (horaAtual < agendHoraFim && horaFimAtendimento > agendHoraInicio);
                });

                horariosDisponiveis.push({
                    horario: horarioStr,
                    disponivel: !ocupado
                });

                horaAtual += 30;
            }
        }

        res.json(horariosDisponiveis);
    } catch (error) {
        console.error('Erro ao buscar horários:', error);
        res.status(500).json({ erro: 'Erro ao buscar horários' });
    }
});

// API: Criar agendamento - NOVO!
router.post("/api/criar-agendamento", verificarLogin, async (req, res) => {
    try {
        const { petId, servicosIds, data, horario, observacoes } = req.body;

        if (!petId || !servicosIds || !data || !horario) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
        }

        const pet = await petModel.findOne({
            where: { 
                id: petId,
                idUsuario: req.session.usuario.id 
            }
        });

        if (!pet) {
            return res.status(400).json({ erro: "Pet não encontrado!" });
        }

        const produtos = await produtoModel.findAll({
            where: { id: servicosIds }
        });

        if (produtos.length === 0) {
            return res.status(400).json({ erro: "Serviços não encontrados!" });
        }

        let valorTotal = produtos.reduce((sum, p) => sum + parseFloat(p.Valor), 0);
        const dataHora = new Date(`${data}T${horario}`);

        const agendamentoExistente = await servicoModel.findOne({
            where: {
                DataAgendamento: {
                    [Op.between]: [
                        new Date(`${data}T00:00:00`),
                        new Date(`${data}T23:59:59`)
                    ]
                },
                HorarioAgendamento: horario,
                Status: { [Op.notIn]: ['Cancelado'] }
            }
        });

        if (agendamentoExistente) {
            return res.status(400).json({ erro: "Horário não está mais disponível" });
        }

        const servico = await servicoModel.create({
            idUsuario: req.session.usuario.id,
            idPet: petId,
            DataAgendamento: dataHora,
            HorarioAgendamento: horario,
            ValorTotal: valorTotal,
            Acrescimo: 0,
            Desconto: 0,
            Observacoes: observacoes || null,
            Status: 'Pendente'
        });

        for (const produtoId of servicosIds) {
            await servicoProdutoModel.create({
                idServico: servico.id,
                idProduto: produtoId
            });
        }

        res.json({ 
            sucesso: true, 
            mensagem: "Agendamento realizado com sucesso!",
            agendamentoId: servico.id
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

// Funções auxiliares
function parseHorario(horarioStr) {
    const [hora, minuto] = horarioStr.split(':').map(Number);
    return hora * 60 + minuto;
}

function formatarHorario(minutos) {
    const hora = Math.floor(minutos / 60);
    const min = minutos % 60;
    return `${String(hora).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

module.exports = router;