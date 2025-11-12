'use strict';

module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define('Produto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Valor: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    Descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    DuracaoMinutos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60
    },
    Ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'PRODUTOS',
    timestamps: true
  });

  return Produto;
};
