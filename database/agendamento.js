module.exports = (sequelize, DataTypes) => {
  const Agendamento = sequelize.define('Agendamento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UsuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    PetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pets',
        key: 'id'
      }
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    horario: {
      type: DataTypes.STRING(5), // "14:30"
      allowNull: false
    },
    servicosIds: {
      type: DataTypes.TEXT, // JSON stringificado: "[1,2,3]"
      allowNull: false
    },
    valorTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duracaoTotal: {
      type: DataTypes.INTEGER, // em minutos
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
    Agendamento.belongsTo(models.Usuario, { foreignKey: 'UsuarioId' });
    Agendamento.belongsTo(models.Pet, { foreignKey: 'PetId' });
  };

  return Agendamento;
};