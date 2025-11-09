'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar tabela Horarios
    await queryInterface.createTable('Horarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      diaSemana: {
        type: Sequelize.ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'),
        allowNull: false
      },
      horarioInicio: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      horarioFim: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Criar tabela Agendamentos
    await queryInterface.createTable('Agendamentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UsuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      PetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      data: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      horario: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      servicosIds: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      valorTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      duracaoTotal: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pendente', 'confirmado', 'concluido', 'cancelado'),
        defaultValue: 'pendente'
      },
      googleEventId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // indices para performance
    await queryInterface.addIndex('Agendamentos', ['data', 'horario']);
    await queryInterface.addIndex('Agendamentos', ['UsuarioId']);
    await queryInterface.addIndex('Agendamentos', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Agendamentos');
    await queryInterface.dropTable('Horarios');
  }
};