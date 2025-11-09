// imports
const express = require("express");
const session = require("express-session");
const path = require("path");

// configurar as paradas
function config(app) {

  app.use(express.static(path.join(__dirname, "public")));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());


  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));



  app.use(
    session({
      secret: "secret-key-unifae-agropec-polar",
      resave: false,
      saveUninitialized: false, 
    })
  );
}

// exports
module.exports = { config, express };
