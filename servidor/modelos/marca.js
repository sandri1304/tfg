var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var marcaSchema = new Schema({
	nombre: { type: String, required: true, index: { unique: true } },
	imagen: String
	//articulos: [{ type: Schema.ObjectId, ref: "articulos" }]
});

marcaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('marcas', marcaSchema);