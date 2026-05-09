"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AnaliseIA extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  AnaliseIA.init(
    {
      userId: DataTypes.INTEGER,
      id_analise: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AnaliseIA",
      tableName: "analises_ia",
      timestamps: false,
    },
  );

  return AnaliseIA;
};
