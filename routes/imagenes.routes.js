const Router = require('express').Router();
const ImagenesController = require('../controllers/imagenes');

const multer  = require('multer');

const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

Router.get("/", ImagenesController.getImagenes);
Router.post("/upload", upload.array('file', 10), ImagenesController.imageUpload);
Router.post("/imagen", ImagenesController.updateImagenesPaciente);
Router.delete("/bimagen", ImagenesController.deleteImagen);

module.exports = Router;