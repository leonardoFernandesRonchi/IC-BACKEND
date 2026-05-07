const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const { criarAnalise } = require("@controllers/analiseController");

const { verifyToken } = require("@middlewares/authentication");

router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "microscopica", maxCount: 1 },
    { name: "colonia", maxCount: 1 },
  ]),
  criarAnalise,
);

module.exports = router;
