// backend/server.js
const express = require("express");
const cors = require("cors");
const tarefasRouter = require("./routes/tarefas");
require("dotenv").config();

const app = express();

// CORS CORRETO PARA O FRONTEND EM 5173
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ROTAS
app.use("/api/tarefas", tarefasRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
