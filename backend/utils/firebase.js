const admin = require('firebase-admin');
const path = require('path');

// Caminho para o JSON da service account
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
let firebaseInitialized = false;

function initFirebase() {
  if (firebaseInitialized || admin.apps.length) {
    return;
  }

  try {
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    firebaseInitialized = true;
    console.log('Firebase Admin inicializado com serviceAccountKey.json');
  } catch (err) {
    console.error('Erro ao inicializar firebase-admin:', err.message || err);
  }
}

async function verifyTokenMiddleware(req, res, next) {
  // Modo bypass (se quiser testar sem auth, é só ligar SKIP_AUTH=true no .env)
  if (String(process.env.SKIP_AUTH).toLowerCase() === 'true') {
    req.user = { uid: process.env.TEST_UID || 'TEST_UID_1' };
    return next();
  }

  // Garante que o Firebase está inicializado
  initFirebase();

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.*)$/);

  if (!match) {
    return res.status(401).json({
      error: 'Nenhum token informado. Header Authorization: Bearer <idToken>'
    });
  }

  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded; // uid, email etc.
    next();
  } catch (err) {
    console.error('Token inválido', err);
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { initFirebase, verifyTokenMiddleware };
