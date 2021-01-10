const Router = require('express').Router();
const ConsultaController = require('../controllers/consulta');

Router.get("/", ConsultaController.getConsulta); 
Router.get("/fechas", ConsultaController.getConsultaFechas);
Router.get("/empresa", ConsultaController.getPacienteConsultaEmpresa);
Router.post("/create", ConsultaController.createConsulta);
// Router.put("/", ConsultaController.updateConsulta);

module.exports = Router;