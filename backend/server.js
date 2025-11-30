require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tarefasRouter = require('./routes/tarefas');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/tarefas', tarefasRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Servidor backend rodando na porta ' + PORT));

