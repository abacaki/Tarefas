import express from 'express';
import dotenv from 'dotenv';
import conectarBanco from './db.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static('./public'));

const PORTA = process.env.PORTA;
const conexao = conectarBanco();

// HTML
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "./public" });
});

// Consulta
app.get("/tarefas", async (req, res)=>{
    const sql = "SELECT * FROM tarefas";
    const resposta = await conexao.query(sql);
    res.json(resposta);
});

// Inclusão
app.post("/tarefas", async (req, res) => {
    const { nome, descricao, responsavel, data_tarefa, concluido } = req.body;
    const sql = "INSERT INTO tarefas (nome, descricao, responsavel, data_tarefa, concluido) VALUES (?, ?, ?, ?, ?)";
    try {
        const resposta = await conexao.query(sql, [
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido
        ]);
        res.status(201).json({
            message: "Tarefa cadastrada com sucesso!",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erro ao cadastrar tarefa" });
    }
});

// Consulta por ID
app.get("/tarefas/:id", async (req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM tarefas WHERE id = ?";
    try {
        const resposta = await conexao.query(sql, [id]);

        if (resposta.length === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        res.json(resposta[0]);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erro ao buscar tarefa" });
    }
});

// Lista de Tarefas por Período
app.get("/tarefas/periodo/:inicio/:fim", async (req, res) => {
    const { inicio, fim } = req.params;
    const sql = "SELECT * FROM tarefas WHERE data_tarefa BETWEEN ? AND ?";
    
    try {
        const resposta = await conexao.query(sql, [inicio, fim]);
        res.json(resposta);
        
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erro ao buscar tarefas por período" });
    }
});

// Atualização
app.put("/tarefas/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { nome, descricao, responsavel, data_tarefa, concluido } = req.body;
    const sql = "UPDATE tarefas SET nome=?, descricao=?, responsavel=?, data_tarefa=?, concluido=? WHERE id=?";
    try {
        const resposta = await conexao.query(sql, [
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido,
            id
        ]);
        // console.log(resposta);

        if (resposta.affectedRows === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada para atualização" });
        }

        res.status(200).json({
            message: "Tarefa atualizada com sucesso!"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erro ao atualizar tarefa" });
    }
});

// Exclusão
app.delete("/tarefas/:id", async (req, res) => {
    const id = Number(req.params.id);
    const sql = "DELETE FROM tarefas WHERE id=?";
    try {
        const resposta = await conexao.query(sql, [id]);

        if (resposta.affectedRows === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada para exclusão" });
        }

        res.status(200).json({ message: "Tarefa excluída com sucesso!" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erro ao excluir tarefa" });
    }
});


app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});