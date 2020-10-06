var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var pagosSchema = new Schema({
    nombre: { type: String, required: true, index: { unique: true } },
    imagen: String
	
});

pagosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('pagos', pagosSchema);