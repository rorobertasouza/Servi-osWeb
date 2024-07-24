API de Comidas
Esta é uma API simples para gerenciamento de alimentos que permite realizar operações CRUD (Create, Read, Update, Delete) utilizando Node.js, MySQL e JWT para autenticação.

Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:

Node.js (versão 14 ou superior)
MySQL Server
Um editor de texto ou IDE de sua preferência
Instalação
Clone este repositório:

bash
Copiar código
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
Instale as dependências:

bash
Copiar código
npm install
Configuração do Banco de Dados
Crie um banco de dados MySQL chamado comidas (ou o nome que preferir):

sql
Copiar código
CREATE DATABASE IF NOT EXISTS comidas;

USE comidas;

-- Criar tabela FOOD
CREATE TABLE IF NOT EXISTS FOOD (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(255),
    calorias INT
);

-- Criar tabela USER
CREATE TABLE IF NOT EXISTS USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(100) NOT NULL
);
Substitua seu_usuario e sua_senha pelas credenciais do seu MySQL e ajuste o arquivo .env conforme necessário.

Variáveis de Ambiente
Renomeie o arquivo .env.example para .env e ajuste as variáveis de ambiente conforme necessário:

env
Copiar código
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=comidas
JWT_SECRET=sua_chave_secreta_jwt
Executando a Aplicação
Inicie o servidor:

bash
Copiar código
npm start
A API estará disponível em http://localhost:3000.

Uso da API
Registrar Usuário: POST /register
Login de Usuário: POST /login (retorna um token JWT para autenticação)
Listar Todos os Alimentos: GET /foods
Criar Novo Alimento: POST /foods
Atualizar Alimento: PUT /foods/:id
Consultar Alimento: GET /foods/:id
Excluir Alimento: DELETE /foods/:id
Observação: É necessário criar um usuário usando o endpoint /register. Após isso, utilize o endpoint /login para obter o token e use-o para autenticar as requisições aos outros endpoints.

Documentação da API
Você pode consultar a documentação detalhada da API aqui: Documentação da API

