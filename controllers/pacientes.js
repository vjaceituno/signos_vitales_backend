const Paciente = require("../models/pacientes");
const mongoose = require('mongoose');

// const path = require("path");
// const UPLOAD_FILES = path.join(__dirname, "/../public/upload/temp");

// const fs = require("fs");
// const fsPromises = fs.promises;

// const { randomNumber } = require('../helpers/libs');

// // let nombreOriginal = "";
// let nombresImagenes = [];
// let imagenesTotales = [];

const createPaciente = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newPaciente = new Paciente(props);
        newPaciente.fullName = `${newPaciente.firstName} ${newPaciente.lastName}`;

        //guardar el paciente en la base de datos
        newPaciente.save()
        .then((paciente) => {
            res.json(paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

//funcion para traer pacientes con filtro
const getPacientes = (req, res) => {
    try {
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.fullName) {
            props.fullName = RegExp(props.fullName, "i");
        }
        Paciente.find(props)
        .exec()
        .then((paciente) => {
            res.json(paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

//actualizar paciente
const updatePaciente = (req, res) => {
    try {
        const props = req.body;     
        props.fullName = `${props.firstName} ${props.lastName}`;
        Paciente.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
        .exec()
        .then((paciente) => {
            res.json(paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getPacienteEmpresa = (req, res) => {
    try {
        const props = req.query;

        if (props.empresa) {
            props.empresa = RegExp(props.empresa, "i");
        }

        Paciente.find(props)
        .exec()
        .then((paciente) => {        
            res.json(paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

const getPacientesPorEmpresa = (req, res) => {
    try {
        
        Paciente.aggregate([{ $group : {_id : '$empresa', total : { $sum : 1 }}  }])
        .exec() 
        .then((paciente) => {        
            res.json(paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

// const updateImagenesPaciente = (req, res) => {
//     try {
//         if (nombresImagenes.length == 0) {
//             return res.status(400).json({ error: "Las imagenes no se han subido" });
//         }
//         const props = req.body;     
        
//         for (let i=0; i<nombresImagenes.length; i++){ 
//             //nuevo nombre de la imagen
//             const imgUrl = randomNumber();
            
//             // Image Location
//             const imageTempPath = path.resolve(`${UPLOAD_FILES}/${nombresImagenes[i].originalname}`);
//             const ext = path.extname(nombresImagenes[i].originalname).toLowerCase();
//             const targetPath = path.resolve(`./public/upload/${imgUrl}${ext}`);

//                 console.log("The file was !"+ imageTempPath + ' para ' + targetPath);
//                 // you wil need the public/temp path or this will throw an error
//                 fs.rename(imageTempPath, targetPath,  err => {
//                     if (err) {
//                         return console.log(err);
//                     }
//                     console.log('renamed complete');
//                 });
//                 console.log("The file was moved!");            
                
//                 const imagen = imgUrl + ext;
                
//                 console.log('imagenes: ', imagen);
//                 imagenesTotales.push(imagen);

//                 console.log('new product: ', newProducto);

//         }

//         props.imagenes = imagenesTotales;
//         Paciente.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
//         .exec()
//         .then((paciente) => {
//             res.json(paciente);
//         })
//         .catch((err) => {
//             res.status(403).json(err.message);
//         });
//     } catch (err) {
//         res.status(500).json({ err: err.message });
//     }
// }

module.exports = {
    createPaciente,
    getPacientes,
    updatePaciente,
    getPacienteEmpresa,
    getPacientesPorEmpresa
    // updateImagenesPaciente
}