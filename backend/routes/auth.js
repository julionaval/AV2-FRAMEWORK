// backend/routes/auth.js
const express = require('express')
const router = express.Router()
const { verifyTokenMiddleware, admin } = require('../utils/firebase')

// -----------------------------------------------------
// GET /api/auth/me  -> Retorna usuário logado
// -----------------------------------------------------
router.get('/me', verifyTokenMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    return res.json({
      uid: req.user.uid,
      email: req.user.email || null
    })
  } catch (err) {
    console.error('Erro em /auth/me:', err)
    return res.status(500).json({ error: 'Erro interno' })
  }
})

// -----------------------------------------------------
// POST /api/auth/logout  -> Remove cookie
// -----------------------------------------------------
router.post('/logout', (req, res) => {
  res.clearCookie('access_token')
  return res.json({ success: true })
})

// -----------------------------------------------------
// POST /api/auth/login  -> Recebe idToken do frontend
// Cria cookie HttpOnly com o token verificado
// -----------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) return res.status(400).json({ error: 'idToken ausente' })

    // verifica token com Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken)

    // grava cookie seguro
    res.cookie('access_token', idToken, {
      httpOnly: true,
      secure: false, // trocar para true se usar HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({
      user: {
        uid: decoded.uid,
        email: decoded.email || null,
      }
    })
  } catch (err) {
    console.error('Erro em /auth/login:', err)
    return res.status(401).json({ error: 'Token inválido' })
  }
})

module.exports = router
