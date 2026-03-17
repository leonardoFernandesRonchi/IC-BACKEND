const express = require("express");
const router = express.Router();
const upload = require("@middlewares/upload");

const {
  createColeta,
  getMyColetas,
  deleteColeta,
} = require("@controllers/coletaController");

const { verifyToken } = require("@middlewares/authentication");

router.post("/", verifyToken, upload.single("image"), createColeta);
router.get("/", verifyToken, getMyColetas);
router.delete("/:id", verifyToken, deleteColeta);

module.exports = router;
