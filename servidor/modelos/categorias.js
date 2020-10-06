var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var categoriasSchema = new Schema({
	nombre: { type: String, required: true, index: { unique: true } },
	imagen: String,
	categoriaGeneral: String
});

categoriasSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('categorias', categoriasSchema);