const mongoose = require("mongoose");

const signosSchema = new mongoose.Schema({
    paciente: { type: mongoose.Types.ObjectId, ref: 'Paciente' },
    presionArterial: { type: String },
    frCardiaca: { type: Number },
    frRespiratoria: { type: Number },
    temperatura: { type: Number },
    peso: { type: Number },
    talla: { type: Number }, 
    imc: { type: Number },
    spo: { type: Number },
    doctor: { type: String },
    estadoConsulta: { type: String, enum: ['pendiente', 'atendido', 'cancelado'], default: 'pendiente' },
    // consulta: { type: mongoose.Types.ObjectId, ref: 'Consulta' }, 
    // pesoideal: { type: Number },

    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    
}, { timestamps: true });

const Signos = mongoose.model("Signos", signosSchema);

module.exports = Signos;