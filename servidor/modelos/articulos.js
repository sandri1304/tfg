var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var articulosSchema = new Schema({
	//_id:Schema.Types.ObjectId,
	codigoArticulo: { type: String, required: true, index: { unique: true } },
	categoria: String,
	modelo: String,
	marca: String,
	pvpTarifa: Number,
	pvp: Number,
	estado: Boolean,
	stock: Number,
	imagen: String,
	caracteristicas: String,
	otros: String,
	fechaModificacion: Date,
	fechaPublicacion: Date,
	autor: String,
	ventas: Number,
	ofertas: { type: Schema.ObjectId, ref: "ofertas" },
	envioGratuito: Boolean,
	estrellas: Number,
	usuarios: Number,
	comentarios: [{ type: Schema.ObjectId, ref: "comentarios" }]


});
articulosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('articulos', articulosSchema);
