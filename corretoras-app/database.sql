CREATE DATABASE corretoras_db;

USE corretoras_db;

CREATE TABLE corretoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_fantasia VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    endereco VARCHAR(255) NOT NULL
);
