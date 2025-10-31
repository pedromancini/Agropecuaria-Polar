// imports
const express = require("express");
const session = require("express-session");
const path = require("path");

// configurar as paradas
function config(app) {
  // arquivos estáticos (CSS, imagens, etc)
  app.use(express.static(path.join(__dirname, "public")));

  // leitura de formulários e JSON
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // motor de views (EJS)
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));


  // sessão (login persistente)
  app.use(
    session({
      secret: "secret-key-auth",
      resave: false,
      saveUninitialized: false, // <-- corrigido
    })
  );
}

// exports
module.exports = { config, express };
