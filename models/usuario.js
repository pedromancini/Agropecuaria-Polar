'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Imagem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    idEndereco: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TipoUsuario: {
      type: DataTypes.ENUM('Cliente', 'Admin'),
      allowNull: false,
      defaultValue: 'Cliente'
    }
  }, {
    tableName: 'USUARIOS',
    timestamps: true
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Agendamento, {
      foreignKey: 'UsuarioId',
      as: 'agendamentos'
    });
  };

  return Usuario;
};