const Router = require('express').Router();
const ServiciosController = require('../controllers/servicios');

Router.get("/", ServiciosController.getServicios);
Router.post("/create", ServiciosController.createServicios);
Router.put("/", ServiciosController.updateServicio);

module.exports = Router;