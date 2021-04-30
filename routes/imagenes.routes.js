const Router = require('express').Router();
const ImagenesController = require('../controllers/imagenes');

const multer  = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

Router.post("/upload", upload.array('file', 8), ImagenesController.imageUpload);
Router.put("/imagen", ImagenesController.updateImagenesPaciente);

module.exports = Router;