const express = require("express");
const { config } = require("./config");
const app = express();




// aplicando as config do config.js
config(app);

const mainRoute = require("./routes/main");
app.use("/", mainRoute);

const cadastroRoute = require("./routes/cadastro");
app.use("/", cadastroRoute);

const authRoute = require("./routes/auth");
app.use("/", authRoute);                     

const perfilRoute = require("./routes/perfil-route");
app.use("/", perfilRoute);

// abrindo server
const port = 1000;
app.listen(port, () => {
    console.log(`online @ localhost:${port}`);
});
