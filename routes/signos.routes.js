const Router = require('express').Router();
const SignosController = require('../controllers/signos');

Router.get("/", SignosController.getSignos);
Router.post("/create", SignosController.createSignos);
Router.get("/doctor", SignosController.getPacientesDoctor);
Router.put("/", SignosController.updateSignos);

module.exports = Router;