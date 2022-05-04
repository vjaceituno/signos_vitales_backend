const Servicios = require("../models/servicios");
const ServiciosConsulta = require("../models/serviciosConsulta")
const Pacientes = require("../models/pacientes");
const Usuarios = require("../models/usuarios");
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

// ServiciosConsulta 
const createServiciosConsulta = (req, res) => {
    try {        
        console.log(req.body);
        const props = req.body;
        const newServiciosConsulta = new ServiciosConsulta(props);
    
        //guardar el Servicio en la base de datos
        newServiciosConsulta.save()
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

const getServiciosConsulta = (req, res) => {
    try {
        console.log('req', req.query);
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.consulta) {
            props.consulta = mongoose.Types.ObjectId(props.consulta);
        }
        if (props.servicio) {
            props.servicio = mongoose.Types.ObjectId(props.servicio);
        }
        // if (props.descripcion) {
        //     props.descripcion = RegExp(props.descripcion, "i");
        // }
        ServiciosConsulta.find(props).populate('servicio')
        .exec()
        .then((servicios) => {
            console.log('servicios: ', servicios);      
            res.json(servicios);  
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

const getServiciosFechas = async (req, res) => {
    try {        
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.paciente) {
            props.paciente = mongoose.Types.ObjectId(props.paciente);
        }        
        
        const serviConsulta = await ServiciosConsulta.aggregate( [
            {
                $project: {
                    paciente: 1,
                    servicio: 1,
                    usuario: 1,
                    precio: 1,                                         
                    createdAt: { 
                        $dateToString: {
                            format: "%Y-%m-%d", date: {$add: ["$createdAt", -6 * 3600000]}
                        }                            
                    }
                }
            }
            ]
        );

        await Servicios.populate(serviConsulta, {path: "servicio"} );
        await Pacientes.populate(serviConsulta, {path: "paciente"} );
        await Usuarios.populate(serviConsulta, {path: "usuario"} );
                
        let servicio = serviConsulta.filter( n =>
            n.createdAt >= props.fechaInicial && n.createdAt <= props.fechaFinal                
        )

        res.json(servicio);        
        
    } catch (err) {        
        res.status(500).json({ err: err.message });
    }

}

module.exports = {
    createServicios,
    getServicios,
    updateServicio,

    createServiciosConsulta,
    getServiciosConsulta,
    getServiciosFechas
}