require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('./auth');

// Configurações
const PORT = 3000;
const app = express();
app.use(express.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Função para gerar hash de senha
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Rota de registro de usuário
app.post('/register', (req, res) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    const hashedPassword = hashPassword(senha);
    db.query('INSERT INTO USER (nome, senha) VALUES (?, ?)', [nome, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
        res.status(201).json({ retorno: "Cadastrado com sucesso", id: result.insertId, nome });
    });
});

// Rota de login de usuário
app.post('/login', (req, res) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    db.query('SELECT * FROM USER WHERE nome = ?', [nome], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Nome ou senha inválidos' });
        }
        const hashedPassword = hashPassword(senha);
        if (hashedPassword !== results[0].senha) {
            return res.status(401).json({ error: 'Nome ou senha inválidos' });
        }
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware de autenticação
app.use(auth);

// Rota GET para listar todos os alimentos
app.get('/foods', (req, res) => {
    db.query('SELECT * FROM FOOD', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        res.json(results);
    });
});

// Rota POST para criar um novo alimento
app.post('/foods', (req, res) => {
    const { nome, categoria, calorias } = req.body;
    if (!nome || !categoria || calorias == null) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    const query = 'INSERT INTO FOOD (nome, categoria, calorias) VALUES (?, ?, ?)';
    db.query(query, [nome, categoria, calorias], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao criar alimento' });
        }
        res.status(201).json({ id: result.insertId, nome, categoria, calorias });
    });
});

// Rota PUT para atualizar um alimento
app.put('/foods/:id', (req, res) => {
    const { id } = req.params;
    const { nome, categoria, calorias } = req.body;
    
    if (!nome || !categoria || calorias == null) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const query = 'UPDATE FOOD SET nome = ?, categoria = ?, calorias = ? WHERE id = ?';
    db.query(query, [nome, categoria, calorias, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar alimento' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Alimento não encontrado' });
        }

        res.json({ message: 'Alimento atualizado com sucesso' });
    });
});

// Rota GET para consultar um único alimento
app.get('/foods/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM FOOD WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar alimento' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Alimento não encontrado' });
        }

        res.json(result[0]);
    });
});

// Rota DELETE para excluir um alimento
app.delete('/foods/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM FOOD WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao excluir alimento' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Alimento não encontrado' });
        }

        res.json({ message: 'Alimento excluído com sucesso' });
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
