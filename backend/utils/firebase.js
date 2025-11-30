const admin = require('firebase-admin');

function initFirebase() {
  // Se variável GOOGLE_APPLICATION_CREDENTIALS estiver definida, firebase-admin carrega automaticamente
  const gpath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!gpath) {
    console.log('GOOGLE_APPLICATION_CREDENTIALS não definido — firebase-admin não será inicializado automaticamente.');
    return;
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
      console.log('Firebase initialized via GOOGLE_APPLICATION_CREDENTIALS');
    }
  } catch (err) {
    console.error('Erro ao inicializar firebase-admin:', err.message || err);
  }
}

async function verifyTokenMiddleware(req, res, next) {
  // Se SKIP_AUTH=true, injeta user de teste e passa adiante
  if (String(process.env.SKIP_AUTH).toLowerCase() === 'true') {
    req.user = { uid: process.env.TEST_UID || 'TEST_UID_1' };
    return next();
  }

  // Caso contrário exige Authorization: Bearer <idToken>
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.*)$/);
  if (!match) return res.status(401).json({ error: 'Nenhum token informado. Header Authorization: Bearer <idToken>' });
  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded; // uid, email...
    next();
  } catch (err) {
    console.error('Token inválido', err);
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { initFirebase, verifyTokenMiddleware };
