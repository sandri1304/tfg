var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var mensajesSchema = new Schema({

    idUsuario: [{ type: Schema.ObjectId, ref: "usuarios" }],
    nombreUsuario: String,
	correoUsuario: String,
	mensaje: String,
	fecha: Date,
	leido: Boolean
});

mensajesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('mensajes', mensajesSchema);