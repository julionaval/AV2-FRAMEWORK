-- Arquivo: db_init_tarefas.sql
-- Cria banco, tabela, índice, usuário e insere dados de teste

-- 1) Cria o banco
CREATE DATABASE IF NOT EXISTS tarefasdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE tarefasdb;

-- 2) Cria tabela tarefas
DROP TABLE IF EXISTS tarefas;
CREATE TABLE IF NOT EXISTS tarefas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NULL,
  prioridade ENUM('baixa','media','alta') NOT NULL DEFAULT 'media',
  status ENUM('pendente','em_andamento','concluida') NOT NULL DEFAULT 'pendente',
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_limite DATETIME NULL,
  INDEX idx_tarefas_user (user_id),
  INDEX idx_data_criacao (data_criacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Cria usuário de aplicação (opcional; substitua SENHA_SEGURA_AQUI)
-- Se preferir não criar usuário, comente as 3 linhas abaixo.
CREATE USER IF NOT EXISTS 'app_tarefas'@'127.0.0.1' IDENTIFIED BY 'SENHA_SEGURA_AQUI';
GRANT SELECT, INSERT, UPDATE, DELETE ON tarefasdb.* TO 'app_tarefas'@'127.0.0.1';
FLUSH PRIVILEGES;

-- 4) Dados de teste (inserts)
INSERT INTO tarefas (user_id, titulo, descricao, prioridade, status, data_limite)
VALUES
('TEST_UID_1', 'Comprar ingredientes', 'Comprar leite, ovos e farinha', 'media', 'pendente', DATE_ADD(NOW(), INTERVAL 3 DAY)),
('TEST_UID_1', 'Enviar relatório', 'Enviar relatório semanal ao professor', 'alta', 'pendente', DATE_ADD(NOW(), INTERVAL 1 DAY)),
('TEST_UID_2', 'Treinar corrida', 'Fazer 5 km', 'baixa', 'em_andamento', NULL);

-- 5) Verificações (opcional)
SELECT '=== DB E TABELA CRIADAS ===' AS info;
SELECT DATABASE() AS current_database;
SELECT COUNT(*) AS total_tarefas FROM tarefas;
