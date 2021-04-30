const Router = require('express').Router();
const PacienteController = require('../controllers/pacientes');

// const multer  = require('multer');
// const path = require('path');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

Router.get("/", PacienteController.getPacientes); 
Router.get("/empresa", PacienteController.getPacienteEmpresa); 
Router.get("/totalemp", PacienteController.getPacientesPorEmpresa); 
Router.post("/create", PacienteController.createPaciente);
Router.put("/", PacienteController.updatePaciente);
// Router.put("/imagenes", PacienteController.updateImagenesPaciente);

module.exports = Router;