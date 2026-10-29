CREATE DATABASE tarefas_db;
USE tarefas_db;

CREATE TABLE tarefas(
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(150) NOT NULL,
descricao TEXT NOT NULL,
responsavel VARCHAR(150) NOT NULL,
data_tarefa DATE NOT NULL,
concluido BOOLEAN NOT NULL
);
DESC tarefas;
SELECT * FROM tarefas;