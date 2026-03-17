const { Coleta } = require("@models");
const fs = require("fs");
const path = require("path");

const { FieldRequiredError } = require("../helpers/customErrors");

async function createColetaService({
  image,
  latitude,
  longitude,
  description,
  userId,
}) {
  if (!image) throw new FieldRequiredError("An image");
  if (!latitude) throw new FieldRequiredError("Latitude");
  if (!longitude) throw new FieldRequiredError("Longitude");

  const coleta = await Coleta.create({
    image,
    latitude,
    longitude,
    description,
    userId,
  });

  return coleta;
}

async function getUserColetasService(userId) {
  return await Coleta.findAll({
    where: { userId },
  });
}

async function deleteColetaService(id, userId) {
  const coleta = await Coleta.findOne({ where: { id, userId } });

  if (!coleta) throw new Error("Coleta not found");

  const filePath = path.join("uploads", coleta.image);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await coleta.destroy();
}

module.exports = {
  createColetaService,
  getUserColetasService,
  deleteColetaService,
};
