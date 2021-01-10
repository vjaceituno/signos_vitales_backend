const Historial = require("../models/historial.js");
const mongoose = require('mongoose');

const createHistorial = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newHistorial = new Historial(props);
    
        //guardar el Historial en la base de datos
        newHistorial.save()
        .then((historial) => {
            res.json(historial);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

//funcion para traer Historial con filtro
const getHistorial = (req, res) => {
    try {
        console.log('req', req.query._id);
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        // if (props.nombre) {
        //     props.nombre = RegExp(props.nombre, "i");
        // }
        Historial.find(props)
        .exec()
        .then((historial) => {
            res.json(historial);        
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

//actualizar paciente
const updateHistorial = (req, res) => {
    try {

        const props = req.body;
        // console.log('pac mod', props);        
        Historial.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
        .exec()
        .then((historial) => {
            res.json(historial);
            console.log('pac mod', historial);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getPacienteConsultaEmpresa = (req, res) => {
    try {
        console.log('req', req.query);
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.paciente) {
            props.paciente = mongoose.Types.ObjectId(props.paciente);
        }
        Historial.find(props).populate('paciente')
        .exec()
        .then((paciente) => {
            res.json(paciente);
            console.log('his', paciente);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

const getHistorialFechas = (req, res) => {
    try {
        console.log('req', req.query);
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.paciente) {
            props.paciente = mongoose.Types.ObjectId(props.paciente);
        }
        
        let f1 = new Date(props.fechaInicial);
        let f2 = new Date(props.fechaFinal);
        f2.setDate(f2.getDate() + 1);
        Historial.find({createdAt: {$gte: f1, $lt: f2}})
        // Historial.find({$and: [{createdAt: {$gte: f1}},{createdAt: {$lt: f2}}]})
        // Historial.find({$and: [{createdAt: {$gte: new Date(f1)}},{createdAt: {$lt: new Date(f2)}}]})
        .populate('paciente')
        .exec()
        .then((consulta) => {
            res.json(consulta);
            // console.log('pac', consulta);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

module.exports = {
    createHistorial,
    getHistorial,
    updateHistorial,
    getPacienteConsultaEmpresa,
    getHistorialFechas
}