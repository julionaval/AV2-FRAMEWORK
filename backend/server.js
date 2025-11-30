require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const tarefasRouter = require('./routes/tarefas');
const { initFirebase } = require('./utils/firebase');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

initFirebase(); // inicializa firebase-admin apenas se GOOGLE_APPLICATION_CREDENTIALS estiver definido

app.use('/api/tarefas', tarefasRouter);

app.get('/', (req, res) => res.send('API Tarefas (MySQL) - funcionando'));

app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
