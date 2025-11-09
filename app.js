const express = require("express");
const { config } = require("./config");
const app = express();

// aplicando as config das parada
config(app);


//rotas
const authRoute = require("./routes/auth");
app.use("/", authRoute);

const cadastroRoute = require("./routes/cadastro");
app.use("/", cadastroRoute);

const perfilRoute = require("./routes/perfil-route");
app.use("/", perfilRoute);

const mainRoute = require("./routes/main");
app.use("/", mainRoute);

const cadastraPetRoute = require("./routes/cadastraPet");
app.use("/", cadastraPetRoute);

const petsRoutes = require("./routes/pets");
app.use("/", petsRoutes);

const agendamentoRoute = require("./routes/agendamento");
app.use("/", agendamentoRoute);

const servicosRoutes = require("./routes/servicos");
app.use("/", servicosRoutes);

const meusAgendamentosRoute = require("./routes/meus-agendamentos");
app.use("/", meusAgendamentosRoute);

// adm
const adminRoutes = require("./routes/admin-routes");
app.use("/", adminRoutes);

// abrindo server
const port = 1000;
app.listen(port, () => {
    console.log(`🚀 Servidor online @ http://localhost:${port}`);
});