'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const diasUteis = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const horarios = [];

    // Criar horários de Segunda a Sexta: 08:00 - 18:00
    diasUteis.forEach(dia => {
      horarios.push({
        diaSemana: dia,
        horarioInicio: '08:00',
        horarioFim: '18:00',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Criar horário de Sábado: 08:00 - 12:00
    horarios.push({
      diaSemana: 'Sábado',
      horarioInicio: '08:00',
      horarioFim: '12:00',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await queryInterface.bulkInsert('Horarios', horarios, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Horarios', null, {});
  }
};