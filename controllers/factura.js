const Factura = require("../models/factura");
const mongoose = require('mongoose');

const createFactura = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newFactura = new Factura(props);
    
        //guardar el Factura en la base de datos
        newFactura.save()
        .then((factura) => {
            res.json(factura);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
        
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

//funcion para traer Factura  con filtro
const getFactura = (req, res) => {
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
        Factura.find(props)
        .exec()
        .then((factura) => {
            res.json(factura);  
            // console.log('servicios: ', servicios);      
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

//actualizar Factura
const updateFsctura = (req, res) => {
    try {
        const props = req.body;
        console.log('REQ', req.body);
        Factura.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
        .exec()
        .then((factura) => {
            res.json(factura);
            console.log('factura', factura);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}


module.exports = {
    createFactura,
    getFactura
   
}