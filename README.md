# Sistema de Gerenciamento de Tarefas – AV2
Projeto desenvolvido para a AV2, utilizando:
- Vue 3 + Vite
- Vuetify 3
- Pinia
- Firebase Authentication (Google Login)
- Node.js + Express
- MySQL
- Firebase Admin (validação segura do token no backend)
O sistema permite:
4 Login com Google
4 Criar, visualizar, editar e excluir tarefas
4 Filtrar tarefas do usuário autenticado
4 Layout responsivo com Vuetify
4 Backend protegido por middleware de autenticação Firebase
## Como Executar o Projeto
### Backend
1. Configurar MySQL
2. Criar serviceAccountKey.json dentro de backend/
3. Rodar:
npm install
npm run dev
### Frontend
1. Configurar Firebase Web SDK no main.js
2. Rodar:
npm install
npm run dev
Acesse: http://localhost:5173
