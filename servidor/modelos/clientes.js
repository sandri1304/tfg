var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var clientesSchema = new Schema({
	nombre: String,
	apellidos: String,
	telefono: String,
	dni: String,
	fechaNacimiento: Date,
	direccionFactura: String,
	codigoPostalFactura: String,
	puebloFactura: String,
	provinciaFactura: String,
	direccionEnvio: String,
	codigoPostalEnvio: String,
	provinciaEnvio: String,
	puebloEnvio: String, 
	pedidos: Number, 
	descuentos: String
});
clientesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('clientes', clientesSchema);