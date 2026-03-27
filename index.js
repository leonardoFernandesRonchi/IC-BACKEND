require("dotenv").config();
require("module-alias/register");
const env = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3001;
const express = require("express");
const { sequelize } = require("./models");
const usersRoutes = require("./routes/users");
const coletaRoutes = require("./routes/coletas");
const cookieParser = require("cookie-parser");

const allowedOrigins = [
  "http://localhost:5173",
  "https://ic-frontend-ecru.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS não permitido"));
    }
  },
  credentials: true,
};

const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "FieldRequiredError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "AlreadyTakenError") {
    return res.status(409).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: err.message });
  }

  res.status(500).json({ message: err.message || "Internal Server Error" });
};

(async () => {
  try {
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Erro:", error);
  }
})();

app.get("/", (req, res) => res.json({ status: "API is running on /api" }));
app.use("/api/users", usersRoutes);
app.use("/api/coletas", coletaRoutes);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
