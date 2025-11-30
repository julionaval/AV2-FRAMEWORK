// backend/utils/firebase.js
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

let credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credPath) {
  console.error('ERRO: Variável GOOGLE_APPLICATION_CREDENTIALS não definida no .env');
  process.exit(1);
}

// resolvendo caminho em relação a este arquivo
const resolvedPath = path.isAbsolute(credPath)
  ? credPath
  : path.resolve(__dirname, '..', credPath);

try {
  const serviceAccount = require(resolvedPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin inicializado com sucesso!');
} catch (err) {
  console.error('Falha ao carregar credenciais Firebase:', err.message);
  process.exit(1);
}

module.exports = admin;

