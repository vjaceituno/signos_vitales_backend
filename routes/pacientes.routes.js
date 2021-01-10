const Router = require('express').Router();
const PacienteController = require('../controllers/pacientes');

Router.get("/", PacienteController.getPacientes); 
Router.get("/empresa", PacienteController.getPacienteEmpresa); 
Router.get("/totalemp", PacienteController.getPacientesPorEmpresa); 
Router.post("/create", PacienteController.createPaciente);
Router.put("/", PacienteController.updatePaciente);

module.exports = Router;