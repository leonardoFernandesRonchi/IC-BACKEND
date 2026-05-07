const { Coleta } = require("@models");
const fs = require("fs");
const path = require("path");

const { FieldRequiredError } = require("../helpers/customErrors");

async function create({
  image,
  latitude,
  longitude,
  description,
  coletaType,
  userId,
}) {
  if (!image) throw new FieldRequiredError("An image");
  if (!coletaType) throw new FieldRequiredError("Tipo da Coleta")
  if (!latitude) throw new FieldRequiredError("Latitude");
  if (!longitude) throw new FieldRequiredError("Longitude");

  const coleta = await Coleta.create({
    image,
    latitude,
    longitude,
    description,
    coletaType,
    userId,
  });

  return coleta;
}

async function getAll(userId, coletaType) {

  const where = {userId}

  if (coletaType) {
    where.coletaType = coletaType;
  }
  return await Coleta.findAll({ where })
}

async function destroy(id, userId) {
  const coleta = await Coleta.findOne({ where: { id, userId } });

  if (!coleta) throw new Error("Coleta not found");

  const filePath = path.join("uploads", coleta.image);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await coleta.destroy();
}

module.exports = {
  create,
  getAll,
  destroy,
};
