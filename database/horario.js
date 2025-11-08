
module.exports = (sequelize, DataTypes) => {
  const Horario = sequelize.define('Horario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    diaSemana: {
      type: DataTypes.ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'),
      allowNull: false
    },
    horarioInicio: {
      type: DataTypes.STRING(5), // "08:00"
      allowNull: false
    },
    horarioFim: {
      type: DataTypes.STRING(5), // "18:00"
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'Horarios',
    timestamps: true
  });

  return Horario;
};