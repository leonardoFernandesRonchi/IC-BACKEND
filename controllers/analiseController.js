const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const { Coleta, AnaliseIA } = require("../models");

const PYTHON_API_URL = "http://127.0.0.1:8000/api";

const criarAnalise = async (req, res) => {
  try {
    const { nome_amostra, descricao, imagem_microscopica, imagem_colonia } =
      req.body;

    const { loggedUser } = req;

    const usuario = loggedUser.id;

    const microscopica_result = await Coleta.findByPk(imagem_microscopica);

    const colonia_result = await Coleta.findByPk(imagem_colonia);

    if (!microscopica_result || !colonia_result) {
      return res.status(404).json({
        erro: "Imagem não encontrada",
      });
    }

    const microscopicaPath = path.join(
      __dirname,
      "..",
      "uploads",
      microscopica_result.image,
    );

    const coloniaPath = path.join(
      __dirname,
      "..",
      "uploads",
      colonia_result.image,
    );

    const microscopicaBuffer = fs.readFileSync(microscopicaPath);

    const coloniaBuffer = fs.readFileSync(coloniaPath);

    const criarResponse = await axios.post(`${PYTHON_API_URL}/analises/`, {
      nome_amostra,
      descricao,
      usuario,
    });

    const analiseId = criarResponse.data.id;

    const microForm = new FormData();

    microForm.append("imagem", microscopicaBuffer, "microscopica.png");

    const microUploadResponse = await axios.post(
      `${PYTHON_API_URL}/analises/${analiseId}/microscopica/`,
      microForm,
      {
        headers: microForm.getHeaders(),
      },
    );

    const newAnalise = await AnaliseIA.create({
      userId: usuario,
      id_analise: microUploadResponse.data.id,
    });

    const imagemId = microUploadResponse.data.id;

    const coloniaForm = new FormData();

    coloniaForm.append("imagem", coloniaBuffer, "colonia.png");

    await axios.post(
      `${PYTHON_API_URL}/analises/${analiseId}/colonia/`,
      coloniaForm,
      {
        headers: coloniaForm.getHeaders(),
      },
    );

    const processamento = await axios.get(
      `${PYTHON_API_URL}/analises/${imagemId}/levedura_segmentada/`,
    );

    return res.json({
      sucesso: true,
      analiseId,
      imagemId,
      resultado: processamento.data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao processar análise",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const analises = await AnaliseIA.findAll({
      where: { userId: req.loggedUser.id },
    });
    for (const analise of analises) {
      const resultado = await axios.get(
        `${PYTHON_API_URL}/analises/${analise.id_analise}/levedura_segmentada/`,
      );
      analise.dataValues.resultado = resultado.data;
    }
    return res.json(analises);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: "Erro ao buscar análises",
    });
  }
};
module.exports = {
  criarAnalise,
  getAll,
};
