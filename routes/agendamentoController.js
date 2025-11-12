// const { Pet, Produto, Agendamento, Usuario, Horario } = require('../models');
// const { Op } = require('sequelize');

// class AgendamentoController {
  
//   // Exibir página de finalização
//   async exibirFinalizacao(req, res) {
//     try {
//       const { petId, servicos } = req.query;
//       const usuarioId = req.session.usuario.id;

//       const pet = await Pet.findOne({
//         where: { id: petId, UsuarioId: usuarioId }
//       });

//       if (!pet) return res.redirect('/agendamento');

//       const servicosIds = servicos.split(',').map(id => parseInt(id));
//       const servicosSelecionados = await Produto.findAll({
//         where: { id: servicosIds }
//       });

//       if (servicosSelecionados.length === 0) {
//         return res.redirect(`/servicos?petId=${petId}`);
//       }

//       const valorTotal = servicosSelecionados.reduce((sum, s) => sum + parseFloat(s.Valor), 0);
//       const duracaoTotal = servicosSelecionados.reduce((sum, s) => sum + s.DuracaoMinutos, 0);

//       res.render('finalizar-agendamento', {
//         pet,
//         servicos: servicosSelecionados,
//         valorTotal,
//         duracaoTotal,
//         usuario: req.session.usuario
//       });

//     } catch (error) {
//       console.error('Erro ao exibir finalização:', error);
//       res.status(500).send('Erro ao carregar página');
//     }
//   }

//   // API: Buscar horários disponíveis
//   async buscarHorariosDisponiveis(req, res) {
//     try {
//       const { data, duracao } = req.query;
      
//       const dataSelecionada = new Date(data + 'T00:00:00');
//       const diaSemana = dataSelecionada.getDay();
//       const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
//       const diaStr = diasSemana[diaSemana];

//       const horariosConfig = await Horario.findAll({
//         where: { 
//           diaSemana: diaStr,
//           ativo: true 
//         },
//         order: [['horarioInicio', 'ASC']]
//       });

//       if (horariosConfig.length === 0) return res.json([]);

//       const agendamentosExistentes = await Agendamento.findAll({
//         where: {
//           data,
//           status: { [Op.ne]: 'cancelado' }
//         }
//       });

//       const horariosDisponiveis = [];
//       const duracaoMinutos = parseInt(duracao);

//       for (const config of horariosConfig) {
//         let horaAtual = this.parseHorario(config.horarioInicio);
//         const horaFim = this.parseHorario(config.horarioFim);

//         while (horaAtual < horaFim) {
//           const horarioStr = this.formatarHorario(horaAtual);
//           const horaFimAtendimento = horaAtual + duracaoMinutos;

//           if (horaFimAtendimento > horaFim) break;

//           const ocupado = agendamentosExistentes.some(agendamento => {
//             const agendHoraInicio = this.parseHorario(agendamento.horario);
//             const agendHoraFim = agendHoraInicio + agendamento.duracaoTotal;
//             return (horaAtual < agendHoraFim && horaFimAtendimento > agendHoraInicio);
//           });

//           horariosDisponiveis.push({
//             horario: horarioStr,
//             disponivel: !ocupado
//           });

//           horaAtual += 30;
//         }
//       }

//       res.json(horariosDisponiveis);

//     } catch (error) {
//       console.error('Erro ao buscar horários:', error);
//       res.status(500).json({ erro: 'Erro ao buscar horários' });
//     }
//   }

//   // API: Criar agendamento
//   async criarAgendamento(req, res) {
//     try {
//       const { petId, servicosIds, data, horario, observacoes } = req.body;
//       const usuarioId = req.session.usuario.id;

//       const pet = await Pet.findOne({
//         where: { id: petId, UsuarioId: usuarioId }
//       });

//       if (!pet) return res.status(400).json({ erro: 'Pet não encontrado' });

//       const servicos = await Produto.findAll({ where: { id: servicosIds } });

//       if (servicos.length === 0) return res.status(400).json({ erro: 'Serviços não encontrados' });

//       const valorTotal = servicos.reduce((sum, s) => sum + parseFloat(s.Valor), 0);
//       const duracaoTotal = servicos.reduce((sum, s) => sum + s.DuracaoMinutos, 0);

//       const conflito = await Agendamento.findOne({
//         where: { data, horario, status: { [Op.ne]: 'cancelado' } }
//       });

//       if (conflito) return res.status(400).json({ erro: 'Horário não está mais disponível' });

//       const agendamento = await Agendamento.create({
//         UsuarioId: usuarioId,
//         PetId: petId,
//         data,
//         horario,
//         servicosIds: JSON.stringify(servicosIds),
//         valorTotal,
//         duracaoTotal,
//         observacoes: observacoes || null,
//         status: 'pendente'
//       });

//       res.json({ 
//         sucesso: true, 
//         agendamentoId: agendamento.id,
//         mensagem: 'Agendamento criado com sucesso'
//       });

//     } catch (error) {
//       console.error('Erro ao criar agendamento:', error);
//       res.status(500).json({ erro: 'Erro ao criar agendamento' });
//     }
//   }

//   // Funções auxiliares
//   parseHorario(horarioStr) {
//     const [hora, minuto] = horarioStr.split(':').map(Number);
//     return hora * 60 + minuto;
//   }

//   formatarHorario(minutos) {
//     const hora = Math.floor(minutos / 60);
//     const min = minutos % 60;
//     return `${String(hora).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
//   }
// }

// module.exports = new AgendamentoController();
