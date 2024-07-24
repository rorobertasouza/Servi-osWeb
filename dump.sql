-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS comidas;

-- Usar o banco de dados criado
USE comidas;

-- Criar tabela ALIMENTO
CREATE TABLE IF NOT EXISTS ALIMENTO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    calorias INT NOT NULL
);

-- Criar tabela USER
CREATE TABLE IF NOT EXISTS USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(100) NOT NULL
);

-- Inserir dados iniciais na tabela ALIMENTO
INSERT INTO ALIMENTO (nome, categoria, calorias) VALUES
    ('Maçã', 'Fruta', 52),
    ('Pizza', 'Fast Food', 266),
    ('Arroz', 'Grão', 130);
