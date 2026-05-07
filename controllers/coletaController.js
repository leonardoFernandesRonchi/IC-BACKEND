const coletaService = require("@services/coletaService");


const create = async (req, res, next) => {
  try {
    const { latitude, longitude, description, coletaType } = req.body;

    const coleta = await coletaService.create({
      image: req.file?.filename,
      latitude,
      longitude,
      description,
      coletaType,
      userId: req.loggedUser.id,
    });

    res.status(201).json(coleta);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const coletas = await coletaService.getAll(req.loggedUser.id, req.query.coletaType);
    res.status(200).json(coletas);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await coletaService.destroy(id, req.loggedUser.id);

    res.status(200).json({ message: "Coleta deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  destroy,
};
