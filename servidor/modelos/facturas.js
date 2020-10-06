const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


var Schema = mongoose.Schema;
var facturaSchema = new Schema ({
	nFactura: Number,
	fecha: Date,
	cliente: {type: Schema.ObjectId, ref: "usuarios"},
	articulos: [{ 
		articulo: {type: Schema.ObjectId, ref: "articulos"},
		cantidad: Number
	}],
	total: Number,
	formaPago: String,
	idPedido: Number,
});

facturaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('facturas', facturaSchema);
