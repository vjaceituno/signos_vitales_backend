const Paciente = require("../models/pacientes");
const mongoose = require('mongoose');

const path = require("path");
const UPLOAD_FILES = path.join(__dirname, "/../public/upload/temp");

const fs = require("fs");
const fsPromises = fs.promises;

const { randomNumber } = require('../helpers/libs');

let nombresImagenes = [];
let imagenesTotales = [];

const imageUpload = (req, res, next) => {
    try{
        if (!req.files) {
            return res.status(400).json({ error: "no image was uploaded" });
        }

        const file = req.files;
        nombresImagenes = [];
        nombresImagenes = file;

        for (let i=0; i<file.length; i++){ 
            console.log('nombre: ', file[i].originalname)
            const ext = path.extname(file[i].originalname).toLowerCase();
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        
                fs.writeFile(`${UPLOAD_FILES}/${file[i].originalname}`, file[i].buffer, err => {
                // la funcion es la que maneja lo que sucede despues de termine el evento
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
                });
   
           }

        }

        res.json({result:'ok'});
        
    } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
}

const updateImagenesPaciente = (req, res) => {
    try {
        
        if (nombresImagenes.length == 0) {
            return res.status(400).json({ error: "Las imagenes no se han subido" });
        }

        const props = req.body;     
        imagenesTotales = [];

        for (let i=0; i<nombresImagenes.length; i++){ 
            //nuevo nombre de la imagen
            const imgUrl = randomNumber();
            
            // Image Location
            const imageTempPath = path.resolve(`${UPLOAD_FILES}/${nombresImagenes[i].originalname}`);
            const ext = path.extname(nombresImagenes[i].originalname).toLowerCase();
            const targetPath = path.resolve(`./public/upload/${imgUrl}${ext}`);

                console.log("The file was !"+ imageTempPath + ' para ' + targetPath);
                // you wil need the public/temp path or this will throw an error
                fs.rename(imageTempPath, targetPath,  err => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('renamed complete');
                });
                console.log("The file was moved!");            
                
                const imagen = imgUrl + ext;
                
                console.log('imagenes: ', imagen);
                imagenesTotales.push(imagen);
              
        }
        // traer las imagenes que ya tiene el paciente
        let arrImagenes = [];
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        Paciente.find(props)
        .exec()
        .then((paciente) => {  
            if (paciente.length != 0){
                this.arrImagenes = paciente[0].imagenes;
                console.log('arrIma', this.arrImagenes);
                console.log('imaTot', imagenesTotales);
                // Actualizar en la base de datos   
                props.imagenes = imagenesTotales;             
                // props.imagenes = this.arrImagenes.concat(imagenesTotales);     
                Paciente.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
                .exec()
                .then((pacienteModificado) => {
                    console.log('pacientemod', pacienteModificado)
                    res.json(pacienteModificado);
                })
                .catch((err) => {
                    res.status(403).json(err.message);
                });
            }
            
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
       
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

module.exports = {
    imageUpload,
    updateImagenesPaciente
}