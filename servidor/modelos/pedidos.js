var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var pedidosSchema = new Schema({
	idPedido: String,
	fechaEntrada: Date,
	fechaEntrega: Date,
	estado: String,
	total: Number,
	formaPago: String,
	cobrado: Boolean,
	usuarios: {type: Schema.ObjectId, ref: "usuarios"},
	//articulos: [{type: Schema.ObjectId, ref: "articulos"}]

	articulos: [{ 
		articulo: {type: Schema.ObjectId, ref: "articulos"},
		cantidad: Number
	}]
});

pedidosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('pedidos', pedidosSchema);
