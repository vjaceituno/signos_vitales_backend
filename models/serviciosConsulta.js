const mongoose = require("mongoose");

const serviosConsultaSchema = new mongoose.Schema({
   
    servicio: { type: mongoose.Types.ObjectId, ref: 'Servicios' },
    paciente: { type: mongoose.Types.ObjectId, ref: 'Paciente' },
    consulta: { type: mongoose.Types.ObjectId, ref: 'Consulta' },
    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },   
    observacion: { type: String },
    precio: { type: Number },
        
}, { timestamps: true });

const ServiciosConsulta = mongoose.model("ServiciosConsulta", serviosConsultaSchema);

module.exports = ServiciosConsulta;