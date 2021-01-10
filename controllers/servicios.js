const Servicios = require("../models/servicios");
const mongoose = require('mongoose');

const createServicios = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newServicios = new Servicios(props);
    
        //guardar el Servicio en la base de datos
        newServicios.save()
        .then((servicios) => {
            res.json(servicios);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

//funcion para traer Servicios con filtro
const getServicios = (req, res) => {
    try {
        console.log('req', req.query);
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        // if (props.paciente) {
        //     props.paciente = mongoose.Types.ObjectId(props.paciente);
        // }
        if (props.descripcion) {
            props.descripcion = RegExp(props.descripcion, "i");
        }
        Servicios.find(props)
        .exec()
        .then((servicios) => {
            res.json(servicios);  
            // console.log('servicios: ', servicios);      
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

//actualizar Servicios
const updateServicio = (req, res) => {
    try {
        const props = req.body;
        console.log('REQ', req.body);
        Servicios.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
        .exec()
        .then((servicio) => {
            res.json(servicio);
            console.log('servicio', servicio);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

module.exports = {
    createServicios,
    getServicios,
    updateServicio
}