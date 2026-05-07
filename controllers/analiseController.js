const axios = require("axios");
const FormData = require("form-data");

const PYTHON_API_URL = "http://127.0.0.1:8000/api";

const criarAnalise = async (req, res) => {
  try {
    const { nome_amostra, descricao, usuario } = req.body;

    const microscopica = req.files.microscopica[0];
    const colonia = req.files.colonia[0];

    // 1. Criar análise
    const criarResponse = await axios.post(`${PYTHON_API_URL}/analises/`, {
      nome_amostra,
      descricao,
      usuario,
    });

    const analiseId = criarResponse.data.id;

    // 2. Upload microscópica
    const microForm = new FormData();

    microForm.append("imagem", microscopica.buffer, microscopica.originalname);

    const microUploadResponse = await axios.post(
      `${PYTHON_API_URL}/analises/${analiseId}/microscopica/`,
      microForm,
      {
        headers: microForm.getHeaders(),
      },
    );

    // AQUI ESTÁ O IMPORTANTE
    const imagemId = microUploadResponse.data.id;

    // 3. Upload colônia
    const coloniaForm = new FormData();

    coloniaForm.append("imagem", colonia.buffer, colonia.originalname);

    await axios.post(
      `${PYTHON_API_URL}/analises/${analiseId}/colonia/`,
      coloniaForm,
      {
        headers: coloniaForm.getHeaders(),
      },
    );

    // 4. Buscar estatísticas
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
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      erro: "Erro ao processar análise",
    });
  }
};

module.exports = {
  criarAnalise,
};
