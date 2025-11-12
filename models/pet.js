'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define('Pet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Sexo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Idade: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Imagem: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Porte: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'PETS',
    timestamps: true
  });

  Pet.associate = (models) => {
    Pet.hasMany(models.Agendamento, {
      foreignKey: 'PetId',
      as: 'agendamentos'
    });
  };

  return Pet;
};