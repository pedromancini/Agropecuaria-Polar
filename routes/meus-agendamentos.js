 express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

// Models
const servicoModel = require("../database/servicoModel");
const petModel = require("../database/petModel");
const produtoModel = require("../database/produtoModel");

// middleware
function verificarLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  next();
}

// rotas

// GET: Página de Meus Agendamentos
router.get("/meus-agendamentos", verificarLogin, async (req, res) => {
  try {
    const servicos = await servicoModel.findAll({
      where: { idUsuario: req.session.usuario.id },
      include: [
        {
          model: petModel,
          as: "PET",
          attributes: ["id", "Nome", "Tipo", "Sexo", "Porte", "Imagem"],
        },
        {
          model: produtoModel,
          as: "PRODUTOS",
          through: { attributes: [] },
          attributes: ["id", "Nome", "Valor"],
        },
      ],
      order: [
        ["DataAgendamento", "DESC"], 
        ["HorarioAgendamento", "DESC"]
      ],
    });

    console.log(`📊 ${servicos.length} agendamentos encontrados para usuário #${req.session.usuario.id}`);

    res.render("meusAgendamentos", {
      servicos,
      usuario: req.session.usuario,
    });
  } catch (error) {
    console.error("❌ Erro ao listar agendamentos:", error);
    res.status(500).send("Erro ao carregar agendamentos");
  }
});


router.post("/agendamento/cancelar/:id", verificarLogin, async (req, res) => {
  try {
    const agendamentoId = req.params.id;
    const usuarioId = req.session.usuario.id;

    // Buscar agendamento
    const servico = await servicoModel.findOne({
      where: {
        id: agendamentoId,
        idUsuario: usuarioId,
      },
    });

    // Validações
    if (!servico) {
      return res.status(404).json({
        sucesso: false,
        erro: "Agendamento não encontrado",
      });
    }

    if (servico.Status === "Cancelado") {
      return res.status(400).json({
        sucesso: false,
        erro: "Este agendamento já foi cancelado",
      });
    }

    if (servico.Status === "Concluído") {
      return res.status(400).json({
        sucesso: false,
        erro: "Não é possível cancelar um agendamento já concluído",
      });
    }

    
    const dataAgendamento = new Date(servico.DataAgendamento);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataAgendamento.setHours(0, 0, 0, 0);

    if (dataAgendamento < hoje) {
      return res.status(400).json({
        sucesso: false,
        erro: "Não é possível cancelar agendamentos passados",
      });
    }

    
    await servico.update({ Status: "Cancelado" });

    console.log(`✅ Agendamento #${agendamentoId} cancelado pelo usuário #${usuarioId}`);

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

router.get("/agendamento/detalhes/:id", verificarLogin, async (req, res) => {
  try {
    const agendamentoId = req.params.id;
    const usuarioId = req.session.usuario.id;

    const servico = await servicoModel.findOne({
      where: {
        id: agendamentoId,
        idUsuario: usuarioId,
      },
      include: [
        {
          model: petModel,
          as: "PET",
        },
        {
          model: produtoModel,
          as: "PRODUTOS",
          through: { attributes: [] },
        },
      ],
    });

    if (!servico) {
      return res.status(404).json({
        sucesso: false,
        erro: "Agendamento não encontrado",
      });
    }

    res.json({
      sucesso: true,
      agendamento: servico,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar detalhes:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao buscar detalhes do agendamento",
    });
  }
});

router.get("/agendamento/estatisticas", verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;

    const estatisticas = await servicoModel.findAll({
      where: { idUsuario: usuarioId },
      attributes: [
        "Status",
        [
          servicoModel.sequelize.fn("COUNT", servicoModel.sequelize.col("id")),
          "total",
        ],
      ],
      group: ["Status"],
      raw: true,
    });

    const stats = {
      total: 0,
      pendentes: 0,
      confirmados: 0,
      concluidos: 0,
      cancelados: 0,
    };

    estatisticas.forEach((stat) => {
      stats.total += parseInt(stat.total);
      if (stat.Status === "Pendente") stats.pendentes = parseInt(stat.total);
      if (stat.Status === "Confirmado")
        stats.confirmados = parseInt(stat.total);
      if (stat.Status === "Concluído") stats.concluidos = parseInt(stat.total);
      if (stat.Status === "Cancelado") stats.cancelados = parseInt(stat.total);
    });

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