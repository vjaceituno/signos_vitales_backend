const mongoose = require("mongoose");

const consultaSchema = new mongoose.Schema({
    paciente: { type: mongoose.Types.ObjectId, ref: 'Paciente' },
    consulta: { type: String },
    motivoConsulta: { type: String }, 
    historiaActual: { type: String },
    apariencia: { type: String },
    cabeza: { type: String },
    bocaFaringe: { type: String },
    cuello: { type: String },
    mamas: { type: String },
    corazon: { type: String },
    pulmones: { type: String }, 
    abdomen: { type: String },
    genitales: { type: String },
    extremidades: { type: String },

    hta: { type: String },
    azucar: { type: Number },
    tabaquismo: { type: String },
    alcoholismo: { type: String },
    embarazo: { type: String },
    lactancia: { type: String },
    visual: { type: String },
    antecovid: { type: String },
    
    examenes: { type: String },
    diagnostico1: { type: String },
    diagnostico2: { type: String },
    plan: { type: String },
    color: { type: String },
    comentario: { type: String },
    precio: { type: Number },
    signos: { type: mongoose.Types.ObjectId, ref: 'Signos' },

    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    
}, { timestamps: true });

const Consulta = mongoose.model("Consulta", consultaSchema);

module.exports = Consulta;