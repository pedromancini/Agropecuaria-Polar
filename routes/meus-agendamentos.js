const express = require("express");
const router = express.Router();
const db = require("../models");
const { Op } = require("sequelize");

// Middleware
function verificarLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  next();
}

// GET: Página de Meus Agendamentos
router.get("/meus-agendamentos", verificarLogin, async (req, res) => {
  try {
    console.log('📋 Buscando agendamentos do usuário:', req.session.usuario.id);

    const agendamentos = await db.Agendamento.findAll({
      where: { UsuarioId: req.session.usuario.id },
      include: [
        {
          model: db.Pet,
          as: "Pet",
          attributes: ["id", "Nome", "Tipo", "Sexo", "Porte", "Imagem", "Idade"],
        }
      ],
      order: [
        ["data", "DESC"],
        ["horario", "DESC"]
      ],
    });

    console.log(`✅ ${agendamentos.length} agendamentos encontrados`);

    // Buscar os produtos/serviços de cada agendamento
    const agendamentosComServicos = await Promise.all(
      agendamentos.map(async (agendamento) => {
        const servicosIds = JSON.parse(agendamento.servicosIds);
        
        const produtos = await db.Produto.findAll({
          where: { id: servicosIds },
          attributes: ["id", "Nome", "Valor", "DuracaoMinutos"],
        });

        return {
          id: agendamento.id,
          data: agendamento.data,
          horario: agendamento.horario,
          valorTotal: agendamento.valorTotal,
          duracaoTotal: agendamento.duracaoTotal,
          observacoes: agendamento.observacoes,
          status: agendamento.status,
          createdAt: agendamento.createdAt,
          Pet: agendamento.Pet,
          Servicos: produtos // Renomeado para Servicos para compatibilidade com a view
        };
      })
    );

    res.render("meusAgendamentos", {
      servicos: agendamentosComServicos, // Mantém o nome "servicos" para a view
      usuario: req.session.usuario,
    });
  } catch (error) {
    console.error("❌ Erro ao listar agendamentos:", error);
    res.status(500).send("Erro ao carregar agendamentos");
  }
});

// POST: Cancelar Agendamento
router.post("/agendamento/cancelar/:id", verificarLogin, async (req, res) => {
  try {
    const agendamentoId = req.params.id;
    const usuarioId = req.session.usuario.id;

    console.log('🗑️ Tentando cancelar agendamento:', agendamentoId);

    // Buscar agendamento
    const agendamento = await db.Agendamento.findOne({
      where: {
        id: agendamentoId,
        UsuarioId: usuarioId,
      },
    });

    // Validações
    if (!agendamento) {
      console.log('❌ Agendamento não encontrado');
      return res.status(404).json({
        sucesso: false,
        erro: "Agendamento não encontrado",
      });
    }

    if (agendamento.status === "cancelado") {
      return res.status(400).json({
        sucesso: false,
        erro: "Este agendamento já foi cancelado",
      });
    }

    if (agendamento.status === "concluido") {
      return res.status(400).json({
        sucesso: false,
        erro: "Não é possível cancelar um agendamento já concluído",
      });
    }

    // Verificar se é data futura
    const dataAgendamento = new Date(agendamento.data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataAgendamento.setHours(0, 0, 0, 0);

    if (dataAgendamento < hoje) {
      return res.status(400).json({
        sucesso: false,
        erro: "Não é possível cancelar agendamentos passados",
      });
    }

    // Cancelar agendamento
    await agendamento.update({ status: "cancelado" });

    console.log(`✅ Agendamento #${agendamentoId} cancelado`);

    res.json({
      sucesso: true,
      mensagem: "Agendamento cancelado com sucesso!",
    });
  } catch (error) {
    console.error("❌ Erro ao cancelar agendamento:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao cancelar agendamento. Tente novamente.",
    });
  }
});

// GET: Detalhes do Agendamento
router.get("/agendamento/detalhes/:id", verificarLogin, async (req, res) => {
  try {
    const agendamentoId = req.params.id;
    const usuarioId = req.session.usuario.id;

    const agendamento = await db.Agendamento.findOne({
      where: {
        id: agendamentoId,
        UsuarioId: usuarioId,
      },
      include: [
        {
          model: db.Pet,
          as: "Pet",
        }
      ],
    });

    if (!agendamento) {
      return res.status(404).json({
        sucesso: false,
        erro: "Agendamento não encontrado",
      });
    }

    // Buscar produtos/serviços
    const servicosIds = JSON.parse(agendamento.servicosIds);
    const produtos = await db.Produto.findAll({
      where: { id: servicosIds },
    });

    res.json({
      sucesso: true,
      agendamento: {
        ...agendamento.toJSON(),
        Servicos: produtos,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar detalhes:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao buscar detalhes do agendamento",
    });
  }
});

// GET: Estatísticas
router.get("/agendamento/estatisticas", verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;

    const agendamentos = await db.Agendamento.findAll({
      where: { UsuarioId: usuarioId },
      attributes: ["status"],
    });

    const stats = {
      total: agendamentos.length,
      pendentes: agendamentos.filter((a) => a.status === "pendente").length,
      confirmados: agendamentos.filter((a) => a.status === "confirmado").length,
      concluidos: agendamentos.filter((a) => a.status === "concluido").length,
      cancelados: agendamentos.filter((a) => a.status === "cancelado").length,
    };

    res.json({
      sucesso: true,
      estatisticas: stats,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao buscar estatísticas",
    });
  }
});

module.exports = router;