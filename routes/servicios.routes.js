const Router = require('express').Router();
const ServiciosController = require('../controllers/servicios');

Router.get("/", ServiciosController.getServicios);
Router.get("/fechas", ServiciosController.getServiciosFechas)
Router.post("/create", ServiciosController.createServicios);
Router.put("/", ServiciosController.updateServicio);

// Servicios Consulta
Router.get("/serviconsulta", ServiciosController.getServiciosConsulta)
Router.post("/serviconsulta", ServiciosController.createServiciosConsulta)

module.exports = Router;