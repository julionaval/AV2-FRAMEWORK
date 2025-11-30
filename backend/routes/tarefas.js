const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyTokenMiddleware } = require('../utils/firebase');

// aplica verificação de token em todas rotas
router.use(verifyTokenMiddleware);

// CREATE
router.post('/', async (req, res) => {
  const uid = req.user.uid;
  const { titulo, descricao = null, prioridade = 'media', status = 'pendente', data_limite = null } = req.body;
  if (!titulo) return res.status(400).json({ error: 'Título é obrigatório' });

  try {
    const [result] = await pool.query(
      'INSERT INTO tarefas (user_id, titulo, descricao, prioridade, status, data_limite) VALUES (?, ?, ?, ?, ?, ?)',
      [uid, titulo, descricao, prioridade, status, data_limite]
    );

    const insertId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM tarefas WHERE id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

// READ all for user
router.get('/', async (req, res) => {
  const uid = req.user.uid;
  try {
    const [rows] = await pool.query('SELECT * FROM tarefas WHERE user_id = ? ORDER BY data_criacao DESC', [uid]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// READ by id
router.get('/:id', async (req, res) => {
  const uid = req.user.uid;
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM tarefas WHERE id = ? AND user_id = ?', [id, uid]);
    if (!rows.length) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const uid = req.user.uid;
  const id = req.params.id;
  const { titulo, descricao, prioridade, status, data_limite } = req.body;

  if (!titulo) return res.status(400).json({ error: 'Título é obrigatório' });

  try {
    const [result] = await pool.query(
      'UPDATE tarefas SET titulo = ?, descricao = ?, prioridade = ?, status = ?, data_limite = ? WHERE id = ? AND user_id = ?',
      [titulo, descricao, prioridade, status, data_limite, id, uid]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarefa não encontrada ou sem permissão' });
    const [rows] = await pool.query('SELECT * FROM tarefas WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const uid = req.user.uid;
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM tarefas WHERE id = ? AND user_id = ?', [id, uid]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarefa não encontrada ou sem permissão' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
});

module.exports = router;
