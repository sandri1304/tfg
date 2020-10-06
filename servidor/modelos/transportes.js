var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var transportesSchema = new Schema({
    nombre: { type: String, required: true, index: { unique: true } },
	
});

transportesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('transportes', transportesSchema);