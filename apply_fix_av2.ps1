# ============================================
# SCRIPT AV2 — CORRIGIDO (SEM ERROS DE ASPAS)
# ============================================

Write-Host "Iniciando correção do projeto AV2..." -ForegroundColor Cyan

# Verificar se é repositório Git
if (!(Test-Path ".git")) {
    Write-Host "ERRO: execute o script na pasta do repositório!" -ForegroundColor Red
    exit 1
}

# Criar branch de correção
git checkout -b fix/review-av2

# ============ Atualizar backend/utils/firebase.js ============
$firebaseJs = @"
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

module.exports = admin;
"@

Set-Content -Path "backend\utils\firebase.js" -Value $firebaseJs -Encoding UTF8

# ============ Atualizar backend/server.js ============
$serverJs = @"
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
"@

Set-Content -Path "backend\server.js" -Value $serverJs -Encoding UTF8

# =============== Criar pasta secrets ===============
if (!(Test-Path "backend\secrets")) {
    New-Item -Type Directory -Path "backend\secrets" | Out-Null
}

# mover JSON se encontrado
$svc = Get-ChildItem -Path "backend" -Filter "*adminsdk*.json" -File -ErrorAction SilentlyContinue
if ($svc) {
    Move-Item $svc.FullName "backend\secrets\firebase-service-account.json" -Force
}

# ================= Gerar .env ==================
$envTxt = @"
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tarefasdb

GOOGLE_APPLICATION_CREDENTIALS=./secrets/firebase-service-account.json
"@

Set-Content -Path "backend\.env" -Value $envTxt -Encoding UTF8

# ================= Gerar .env.example ==================
Set-Content -Path "backend\.env.example" -Value $envTxt -Encoding UTF8

# ================= FRONTEND: API ==================
$apiJs = @"
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export default api;
"@

Set-Content -Path "frontend\src\services\api.js" -Value $apiJs -Encoding UTF8

# ================= FRONTEND: main.js ==================
$mainJs = @"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
"@

Set-Content -Path "frontend\src\main.js" -Value $mainJs -Encoding UTF8

# ================= FRONTEND: vuetify.js ==================
$vuetifyJs = @"
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives
})
"@

Set-Content -Path "frontend\src\plugins\vuetify.js" -Value $vuetifyJs -Encoding UTF8

# ================= FRONTEND: vite.config.js ==================
$viteJs = @"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
"@

Set-Content -Path "frontend\vite.config.js" -Value $viteJs -Encoding UTF8

# =========== Remover arquivos ShowToken ===========
if (Test-Path "frontend\ShowToken.vue") {
    git rm -f "frontend/ShowToken.vue"
}
if (Test-Path "frontend\src\views\ShowToken.vue") {
    git rm -f "frontend/src/views/ShowToken.vue"
}

# =========== Atualizar .gitignore ===========
$ignore = @"
backend/secrets/
backend/projeto-*-firebase*.json
.env
.env.*
dist/
node_modules/
"@

Add-Content -Path ".gitignore" -Value $ignore

# =========== README.md ===========
$readme = @"
# AV2 FRAMEWORK — PROJETO COMPLETO

## ✔ Tecnologias
- Node.js + Express
- MySQL
- Firebase Admin
- Vue 3 + Vite
- Vuetify 3
- Pinia
- Axios

## ✔ Como rodar

### BACKEND
cd backend  
npm install  
node server.js  

### FRONTEND
cd frontend  
npm install  
npm run dev  

Acesse: http://localhost:5173
"@

Set-Content -Path "README.md" -Value $readme -Encoding UTF8

# =========== Commit e Push ===========
git add .
git commit -m "Correção completa da AV2 — backend, frontend, firebase, vite"
git push -u origin fix/review-av2

Write-Host "CORRIGIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "Agora entre no GitHub e crie o Pull Request." -ForegroundColor Cyan
