const express = require("express");
const router = express.Router();
const upload = require("@middlewares/upload");

const {
  create,
  getAll,
  destroy,
} = require("@controllers/coletaController");

const { verifyToken } = require("@middlewares/authentication");

router.post("/", verifyToken, upload.single("image"), create);
router.get("/", verifyToken, getAll);
router.delete("/:id", verifyToken, destroy);

module.exports = router;
