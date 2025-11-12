'use strict';

module.exports = (sequelize, DataTypes) => {
  const Agendamento = sequelize.define('Agendamento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UsuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    horario: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    servicosIds: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    valorTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duracaoTotal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pendente', 'confirmado', 'concluido', 'cancelado'),
      defaultValue: 'pendente'
    },
    googleEventId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Agendamentos',
    timestamps: true
  });

  Agendamento.associate = (models) => {
    // Importante: use o nome exato do modelo exportado
    const UsuarioModel = models.Usuario || models.USUARIO;
    const PetModel = models.Pet || models.PET;
    
    if (UsuarioModel) {
      Agendamento.belongsTo(UsuarioModel, { 
        foreignKey: 'UsuarioId',
        as: 'Usuario'
      });
    }
    
    if (PetModel) {
      Agendamento.belongsTo(PetModel, { 
        foreignKey: 'PetId',
        as: 'Pet'
      });
    }
  };

  return Agendamento;
};