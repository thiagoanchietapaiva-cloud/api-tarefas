const express = require("express");
const app = express();


app.get("/", (req, res) => {
    res.send("ola mundo");
});

app.get("/usuarios", (req, res) => {
    res.send(`buscar usuarios`);
});

app.get("/usuarios", (req, res) => {
    res.send(`criar usuario`);
});
app.get("/usuarios", (req, res) => {
    res.send(`editar usuario`);
});

app.get("/usuarios", (req, res) => {
    res.send(`deleta usuario`);
});


app.use((req, res) => {
    res.status(404).send("Rota não encontrada");
});

app.listen(3000, () => {
    console.log("servidor on: http://localhost:3000");
});