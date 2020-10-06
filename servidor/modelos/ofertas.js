var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var ofertasSchema = new Schema({
	idOferta: { type: String, required: true, index: { unique: true } },
	descuento: Number,
	fechaInicio: Date,
	fechaFin: Date,
	descripcion: String,
});

ofertasSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('ofertas', ofertasSchema);
