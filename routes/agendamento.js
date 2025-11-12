const express = require("express");
const router = express.Router();
const db = require('../models'); 
const { Op } = require('sequelize');

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

router.get("/finalizar-agendamento", verificarLogin, async (req, res) => {
    try {
        const { petId, servicos } = req.query;
        const usuarioId = req.session.usuario.id;

        const pet = await db.Pet.findOne({
            where: { id: petId, idUsuario: usuarioId }
        });

        if (!pet) return res.redirect('/agendamento');

        const servicosIds = servicos.split(',').map(id => parseInt(id));
        const servicosSelecionados = await db.Produto.findAll({
            where: { id: servicosIds }
        });

        if (servicosSelecionados.length === 0) {
            return res.redirect(`/servicos?petId=${petId}`);
        }

        const valorTotal = servicosSelecionados.reduce((sum, s) => sum + parseFloat(s.Valor), 0);
        const duracaoTotal = servicosSelecionados.reduce((sum, s) => sum + s.DuracaoMinutos, 0);

        res.render('finalizar-agendamento', {
            pet,
            servicos: servicosSelecionados,
            valorTotal,
            duracaoTotal,
            usuario: req.session.usuario
        });

    } catch (error) {
        console.error('Erro ao exibir finalização:', error);
        res.status(500).send('Erro ao carregar página');
    }
});

// API: Buscar horários disponíveis
router.get("/api/horarios-disponiveis", verificarLogin, async (req, res) => {
    try {
        const { data, duracao } = req.query;
        
        const dataSelecionada = new Date(data + 'T00:00:00');
        const diaSemana = dataSelecionada.getDay();
        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const diaStr = diasSemana[diaSemana];

        const agora = new Date();
        const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const dataEscolhida = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), dataSelecionada.getDate());
        const ehHoje = dataEscolhida.getTime() === hoje.getTime();
        
        // Hora atual em minutos
        // Adiciona margem de segurança de 30 minutos
        const margemSeguranca = 30;
        const horaAtualMinutos = ehHoje ? (agora.getHours() * 60 + agora.getMinutes() + margemSeguranca) : 0;

        console.log('📅 Data selecionada:', data, '| Dia:', diaStr);
        console.log('🕐 É hoje?', ehHoje);
        if (ehHoje) {
            console.log('⏰ Hora atual + margem:', formatarHorario(horaAtualMinutos));
        }

        // Buscar configurações de horário
        const horariosConfig = await db.Horario.findAll({
            where: { 
                diaSemana: diaStr,
                ativo: true 
            },
            order: [['horarioInicio', 'ASC']]
        });

        if (horariosConfig.length === 0) {
            console.log('⚠️ Nenhum horário configurado para', diaStr);
            return res.json([]);
        }

        // Buscar agendamentos existentes
        const agendamentosExistentes = await db.Agendamento.findAll({
            where: {
                data,
                status: { [Op.ne]: 'cancelado' }
            }
        });

        console.log('📋 Agendamentos existentes:', agendamentosExistentes.length);

        const horariosDisponiveis = [];
        const duracaoMinutos = parseInt(duracao);
        for (const config of horariosConfig) {
            let horaAtual = parseHorario(config.horarioInicio);
            const horaFim = parseHorario(config.horarioFim);

            while (horaAtual < horaFim) {
                const horarioStr = formatarHorario(horaAtual);
                const horaFimAtendimento = horaAtual + duracaoMinutos;
                if (horaFimAtendimento > horaFim) break;


                const jaPasou = ehHoje && horaAtual <= horaAtualMinutos;

                const ocupado = agendamentosExistentes.some(agendamento => {
                    const agendHoraInicio = parseHorario(agendamento.horario);
                    const agendHoraFim = agendHoraInicio + agendamento.duracaoTotal;
                    return (horaAtual < agendHoraFim && horaFimAtendimento > agendHoraInicio);
                });


                horariosDisponiveis.push({
                    horario: horarioStr,
                    disponivel: !ocupado && !jaPasou
                });

                horaAtual += 30;
            }
        }

        console.log('✅ Total de horários:', horariosDisponiveis.length);
        console.log('🟢 Disponíveis:', horariosDisponiveis.filter(h => h.disponivel).length);
        console.log('🔴 Indisponíveis:', horariosDisponiveis.filter(h => !h.disponivel).length);

        res.json(horariosDisponiveis);

    } catch (error) {
        console.error('❌ Erro ao buscar horários:', error);
        res.status(500).json({ erro: 'Erro ao buscar horários' });
    }
});

// API: Criar agendamento
router.post("/api/criar-agendamento", verificarLogin, async (req, res) => {
    try {
        const { petId, servicosIds, data, horario, observacoes } = req.body;
        const usuarioId = req.session.usuario.id;

        console.log('📝 Tentando criar agendamento:', { petId, data, horario });

        // Validar pet
        const pet = await db.Pet.findOne({
            where: { id: petId, idUsuario: usuarioId }
        });

        if (!pet) {
            console.log('❌ Pet não encontrado');
            return res.status(400).json({ erro: 'Pet não encontrado' });
        }

        // Validar serviços
        const servicos = await db.Produto.findAll({ where: { id: servicosIds } });

        if (servicos.length === 0) {
            console.log('❌ Serviços não encontrados');
            return res.status(400).json({ erro: 'Serviços não encontrados' });
        }

        const valorTotal = servicos.reduce((sum, s) => sum + parseFloat(s.Valor), 0);
        const duracaoTotal = servicos.reduce((sum, s) => sum + s.DuracaoMinutos, 0);

        // ⭐ NOVO: Validar se o horário não está no passado
        const dataHorario = new Date(data + 'T' + horario);
        const agora = new Date();
        
        if (dataHorario < agora) {
            console.log('❌ Tentativa de agendar no passado');
            return res.status(400).json({ erro: 'Não é possível agendar em horários passados' });
        }

        // Verificar conflito
        const conflito = await db.Agendamento.findOne({
            where: { data, horario, status: { [Op.ne]: 'cancelado' } }
        });

        if (conflito) {
            console.log('❌ Horário já ocupado');
            return res.status(400).json({ erro: 'Horário não está mais disponível' });
        }

        // Criar agendamento
        const agendamento = await db.Agendamento.create({
            UsuarioId: usuarioId,
            PetId: petId,
            data,
            horario,
            servicosIds: JSON.stringify(servicosIds),
            valorTotal,
            duracaoTotal,
            observacoes: observacoes || null,
            status: 'pendente'
        });

        console.log('✅ Agendamento criado com sucesso:', agendamento.id);

        res.json({ 
            sucesso: true, 
            agendamentoId: agendamento.id,
            mensagem: 'Agendamento criado com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro ao criar agendamento:', error);
        res.status(500).json({ erro: 'Erro ao criar agendamento' });
    }
});

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