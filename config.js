// imports
const express = require("express")
const path = require("path")
const router = express.Router()

// configurar as paradas
function config(app) {
    app.use(express.static(path.join(__dirname, "public")))
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    app.set("view engine", "ejs")
}

// exports
module.exports = { config, router, express }