const {
  createColetaService,
  getUserColetasService,
  deleteColetaService,
} = require("@services/coletaService");

const createColeta = async (req, res, next) => {
  try {
    const { latitude, longitude, description } = req.body;

    const coleta = await createColetaService({
      image: req.file?.filename,
      latitude,
      longitude,
      description,
      userId: req.loggedUser.id,
    });

    res.status(201).json(coleta);
  } catch (error) {
    next(error);
  }
};

const getMyColetas = async (req, res, next) => {
  try {
    const coletas = await getUserColetasService(req.loggedUser.id);
    res.status(200).json(coletas);
  } catch (error) {
    next(error);
  }
};

const deleteColeta = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteColetaService(id, req.loggedUser.id);

    res.status(200).json({ message: "Coleta deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createColeta,
  getMyColetas,
  deleteColeta,
};
