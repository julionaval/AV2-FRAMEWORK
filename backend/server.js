// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const tarefasRouter = require('./routes/tarefas');

const app = express();
app.use(express.json());
app.use(cookieParser()); // necessário para ler cookies (access_token)

// CORS — permite o Vite (frontend em 5173) enviar cookies com credenciais
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// registrar rota de autenticação (criada: backend/routes/auth.js)
app.use('/api/auth', require('./routes/auth'));

// rotas de tarefas (protegidas pelo verifyTokenMiddleware dentro do router)
app.use('/api/tarefas', tarefasRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Servidor backend rodando na porta ' + PORT));
