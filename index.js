const express = require("express");
const cors = require("cors");
const executarSQL = require("./services");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Olá mundo");
});


app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        const query = await executarSQL(
            "SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha = $2;",
            [email, senha]
        );

        if (query.rowCount === 0) {
            return res.json({
                tipo: "warning",
                mensagem: "Email ou senha inválidos"
            });
        }

        res.json({
            tipo: "success",
            mensagem: "Login realizado com sucesso",
            usuario: query.rows[0]
        });
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const query = await executarSQL("SELECT id, nome, email FROM usuarios;");
        res.json(query.rows);
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const emailExiste = await executarSQL(
            "SELECT id FROM usuarios WHERE email = $1;",
            [email]
        );

        if (emailExiste.rowCount > 0) {
            return res.json({
                tipo: "warning",
                mensagem: "Email já cadastrado"
            });
        }

        const query = await executarSQL(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email;",
            [nome, email, senha]
        );

        if (query.rowCount > 0) {
            return res.json({
                tipo: "success",
                mensagem: "Registro criado com sucesso.",
                usuario: query.rows[0]
            });
        }

        res.json({
            tipo: "warning",
            mensagem: "Falha ao criar registro."
        });
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.put("/usuarios/:id", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const { id } = req.params;

        const query = await executarSQL(
            "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING id, nome, email;",
            [nome, email, senha, id]
        );

        if (query.rowCount > 0) {
            return res.json({
                tipo: "success",
                mensagem: "Registro atualizado com sucesso."
            });
        }

        res.json({
            tipo: "warning",
            mensagem: "Registro não encontrado."
        });
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const query = await executarSQL(
            "DELETE FROM usuarios WHERE id = $1 RETURNING id;",
            [id]
        );

        if (query.rowCount > 0) {
            return res.json({
                tipo: "success",
                mensagem: "Registro deletado com sucesso"
            });
        }

        res.json({
            tipo: "warning",
            mensagem: "Registro não encontrado"
        });
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.get("/tarefas", async (req, res) => {
    try {
        const query = await executarSQL("SELECT * FROM tarefas;");
        res.json(query.rows);
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.get("/tarefas/:usuario_id", async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const query = await executarSQL(
            "SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY id;",
            [usuario_id]
        );
        res.json(query.rows);
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.post("/tarefas", async (req, res) => {
    try {
        const { titulo, descricao, usuario_id } = req.body;

        const query = await executarSQL(
            "INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *;",
            [titulo, descricao, usuario_id]
        );

        if (query.rowCount > 0) {
            return res.json({
                tipo: "success",
                mensagem: "Registro criado com sucesso",
                tarefa: query.rows[0]
            });
        }

        res.json({
            tipo: "warning",
            mensagem: "Falha ao criar registro"
        });
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.put("/tarefas/:id", async (req, res) => {
    try {
        const { titulo, descricao } = req.body;
        const { id } = req.params;

        const query = await executarSQL(
            "UPDATE tarefas SET titulo = $1, descricao = $2 WHERE id = $3 RETURNING *;",
            [titulo, descricao, id]
        );

        if (query.rowCount > 0) {
            return res.json({
                tipo: "success",
                mensagem: "Registro atualizado com sucesso"
            });
        }

        res.json({
            tipo: "warning",
            mensagem: "Registro não encontrado"
        });
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.delete("/tarefas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const query = await executarSQL(
            "DELETE FROM tarefas WHERE id = $1 RETURNING id;",
            [id]
        );

        if (query.rowCount > 0) {
            return res.json({
                tipo: "success",
                mensagem: "Registro deletado com sucesso"
            });
        }

        res.json({
            tipo: "warning",
            mensagem: "Registro não encontrado"
        });
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ mensagem: "Rota não encontrada" });
});

app.listen(3000, () => {
    console.log("Servidor on: http://localhost:3000");
});