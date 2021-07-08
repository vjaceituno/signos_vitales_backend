const mongoose = require("mongoose");

const imagenSchema = new mongoose.Schema({

    nombre: { type: String },
    paciente: { type: mongoose.Types.ObjectId, ref: 'Paciente' },
    imagen: { type: String },
    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },

}, { timestamps: true });

const Imagenes = mongoose.model("Imagenes", imagenSchema);

module.exports = Imagenes;