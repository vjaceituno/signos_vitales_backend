const mongoose = require("mongoose");

const serviosSchema = new mongoose.Schema({
   
    descripcion: { type: String },
    precio: { type: Number },
    estado: { type: Boolean, default: true },
    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    
        
}, { timestamps: true });

const Servicios = mongoose.model("Servicios", serviosSchema);

module.exports = Servicios;