// backend/utils/firebase.js
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

let credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credPath) {
  console.error('ERRO: Variável GOOGLE_APPLICATION_CREDENTIALS não definida no .env');
  process.exit(1);
}

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

/**
 * Middleware para verificar token Firebase (ID token).
 * - Procura token em: Authorization: Bearer <token> OR cookie "access_token".
 * - Em caso de sucesso, preenche req.user = { uid, email, ... } e chama next().
 * - Em caso de falha, responde 401.
 *
 * Para facilitar desenvolvimento, defina SKIP_AUTH=true no .env para pular verificação.
 */
async function verifyTokenMiddleware(req, res, next) {
  try {
    // permite saltar autenticação em modo de teste
    if (process.env.SKIP_AUTH === 'true' || process.env.SKIP_AUTH === '1') {
      // se quiser um usuário de teste, pode setar TEST_UID no .env
      const testUid = process.env.TEST_UID || 'TEST_UID';
      req.user = { uid: testUid };
      return next();
    }

    // 1) buscar token no header Authorization
    const authHeader = req.headers.authorization || '';
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2) se não veio por header, tentar cookie "access_token"
    if (!token && req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    // 3) se ainda não tem token, 401
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // 4) verificar token com Firebase Admin
    const decoded = await admin.auth().verifyIdToken(token);
    // decoded contém uid, email, etc.
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      ...decoded,
    };
    return next();
  } catch (err) {
    console.error('verifyTokenMiddleware error:', err.message || err);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = {
  admin,
  verifyTokenMiddleware,
};

