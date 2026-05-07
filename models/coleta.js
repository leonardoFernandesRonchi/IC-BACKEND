"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coleta extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Coleta.init(
    {
      image: DataTypes.STRING,
      latitude: DataTypes.DOUBLE,
      longitude: DataTypes.DOUBLE,
      description: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      coletaType: {
        type: DataTypes.ENUM("Microscopica", "Colonia"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Coleta",
    },
  );

  return Coleta;
};
