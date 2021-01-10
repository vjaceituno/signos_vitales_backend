const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
   
    paciente: { type: mongoose.Types.ObjectId, ref: 'Paciente' },
    RTNPaciente: String,
    fecha: Date,
    noFactura: Number,
    
    servicios: [{
        servicio: { type: mongoose.Types.ObjectId, ref: 'Servicios' },
        cantidad: Number,
        descripcion: String,
        preciounitario: Number,
        preciototal: Number
    }],

    subtotal: Number,
    impuesto: Number,
    total: Number,
    estado: String,
    comentario: String,
    
    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    
}, { timestamps: true });

const Factura = mongoose.model("Factura", facturaSchema);

module.exports = Factura;