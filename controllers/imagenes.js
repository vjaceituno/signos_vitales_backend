const Paciente = require("../models/pacientes");
const Imagenes = require("../models/imagenes");
const mongoose = require('mongoose');

const path = require("path");
const UPLOAD_FILES = path.join(__dirname, "/../public/upload/temp");

const fs = require("fs");
const fsPromises = fs.promises;

const { randomNumber } = require('../helpers/libs');

let nombresImagenes = [];
// let imagenesTotales = [];

const imageUpload = (req, res, next) => {
    try{
        if (!req.files) {
            return res.status(400).json({ error: "no image was uploaded" });
        }

        nombresImagenes = [];
        const file = req.files;
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
        const props = req.body;  

        if (nombresImagenes.length == 0) {
            return res.status(400).json({ error: "Las imagenes no se han subido" });
        }

        if (props.paciente === null){
            return res.status(400).json({ error: "Id del paciente es requerido"})
        }
           
        let imagenesTotales = [];

        for (let i=0; i<nombresImagenes.length; i++){ 
            //nuevo nombre de la imagen
            const imgUrl = randomNumber();
            
            // Image Location
            const imageTempPath = path.resolve(`${UPLOAD_FILES}/${nombresImagenes[i].originalname}`);
            const ext = path.extname(nombresImagenes[i].originalname).toLowerCase();
            const targetPath = path.resolve(`./public/upload/${imgUrl}${ext}`);

                console.log("The file was !" + imageTempPath + ' para ' + targetPath);
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
            
            // Guardar en BD en la tabla de imagenes
            props.nombre = nombresImagenes[i].originalname;
            props.imagen = imagen;  
            console.log('props', props);
            const newImagenes = new Imagenes(props);
            newImagenes.save()
            .then((imagenes) => {
                console.log('imaTable', imagenes);
                res.json(imagenes);
            })
            .catch((err) => {
                console.log('err', err.message);
                res.status(403).json(err.message);
            });            
        }

        // traer las imagenes que ya tiene el paciente
        // let arrImagenes = [];
        // if (props.paciente) {
        //     props.paciente = mongoose.Types.ObjectId(props.paciente);
        // }
        
        // // props.imagenes = imagenesTotales;  
        // // console.log('props', props);
        // // const newImagenes = new Imagenes(propss);
        // // newImagenes.save()
        // // .then((imagenes) => {
        // //     console.log('ima', imagenes);
        // //     res.json(imagenes);
        // // })
        // // .catch((err) => {
        // //     console.log('err', err.message);
        // //     res.status(403).json(err.message);
        // // });                        

        // Paciente.findOne(props.paciente)
        // .exec()
        // .then((paciente) => {  
        //     if (paciente != null){
        //         if (paciente.length != 0){
        //             this.arrImagenes = paciente.imagenes;
        //             console.log('arrIma', this.arrImagenes);
        //             console.log('imaTot', imagenesTotales);
        //             // Actualizar en la base de datos   
        //             // props.imagenes = imagenesTotales;  
        //             // imagenesTotales = ["0dz6hmq.jpg", "014wzje.jpg", "0bfvcm6.png", "03r7aqz.jpg", "0rjxp26.png", "0et34rg.png", "0berile.jpg", "0f3gqln.png"];           
                    
        //             props.imagenes = this.arrImagenes.concat(imagenesTotales);  
                    
        //             Paciente.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
        //             .exec()
        //             .then((pacienteModificado) => {                        
        //                 res.json(pacienteModificado);
        //             })
        //             .catch((err) => {
        //                 res.status(403).json(err.message);
        //             });
        //         }
        //     }            
            
        // })
        // .catch((err) => {
        //     res.status(403).json(err.message);
        // });
       
    } catch (err) {
        console.log('err', err.message);
        // eliminar la imagen de la carpeta del server
        for (let i=0; i < nombresImagenes.length; i++){            
            fs.unlink(path.resolve("./public/upload/temp/" + nombresImagenes[i].originalname),  err => {
                if (err) {
                    return console.log(err);
                }
                console.log('delete complete');
            });
        }
        res.status(500).json({ err: err.message });
    }
}

const deleteImagen = (req, res) => {
    try {
        const props = req.query;
        console.log('req', props);
        Imagenes.findOneAndDelete({_id: mongoose.Types.ObjectId(props._id), paciente: mongoose.Types.ObjectId(props.paciente) })
        .exec()
        .then((imagen) => {
            // eliminar la imagen de la carpeta del server
            fs.unlink(path.resolve("./public/upload/" + imagen),  err => {
                if (err) {
                    return console.log(err);
                }
                console.log('delete complete');
            });
           
            res.json(imagen);
        })
        .catch((err) => {
            console.log('err', err.message);
            res.status(403).json(err.message);
        });           

        // traer las imagenes que ya tiene el paciente
        // let arrImagenes = [];
        // Paciente.findOne({_id: mongoose.Types.ObjectId(props.params.paciente) })
        // .exec() 
        // .then((paciente) => {  
        //     if (paciente != null){ 
        //         if (paciente.length != 0){
        //             this.arrImagenes = paciente.imagenes;            
        //             let imagen = this.arrImagenes[props.params.idxFoto];

        //             // Actualizar en la base de datos   
        //             this.arrImagenes.splice(props.params.idxFoto, 1);       
        //             props.params.imagenes = this.arrImagenes;  
 
        //             Paciente.findOneAndUpdate({_id: mongoose.Types.ObjectId(props.params.paciente) }, { $set: { imagenes: props.params.imagenes } }, { new: true })
        //             .exec()
        //             .then((pacienteModificado) => {
        //                 // eliminar la imagen de la carpeta del server
        //                 fs.unlink(path.resolve("./public/upload/" + imagen),  err => {
        //                     if (err) {
        //                         return console.log(err);
        //                     }
        //                     console.log('delete complete');
        //                 });
                       
        //                 res.json(pacienteModificado);
        //             })
        //             .catch((err) => {
        //                 res.status(403).json(err.message);
        //             });
        //         }
        //     }
            
            
        // })
        // .catch((err) => {
        //     res.status(403).json(err.message);
        // });
                     
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getImagenes = (req, res) => {
    try {
        console.log('req', req.query);
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.paciente) {
            props.paciente = mongoose.Types.ObjectId(props.paciente);
        }
        if (props.usuario) {
            props.usuario = mongoose.Types.ObjectId(props.usuario);
        }
        Imagenes.find(props)
        .exec()
        .then((imagenes) => {
            // console.log('imapac', imagenes);
            res.json(imagenes);    
        })
        .catch((err) => {
            // console.log('err', err.message);
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

module.exports = {
    imageUpload,
    updateImagenesPaciente,
    deleteImagen, 
    getImagenes
}