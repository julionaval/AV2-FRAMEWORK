require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initFirebase } = require('./utils/firebase');
const tarefasRoutes = require('./routes/tarefas'); // 👈 importa o router

const app = express();

// Middleware globais
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.options('*', cors());

// inicializa Firebase Admin
initFirebase();

// 👇 AQUI você liga o router na URL /api/tarefas
app.use('/api/tarefas', tarefasRoutes);

// (opcional) rota simples pra testar se o servidor está vivo
app.get('/', (req, res) => {
  res.send('API rodando');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});

