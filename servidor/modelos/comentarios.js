var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var comentariosSchema = new Schema({
    calificacionGeneral: Number,
    titulo: String,
    comentario: String,
    recomendacion: Boolean,
    calidadPrecio: Number,
    alias: String,
    email:String
});

comentariosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('comentarios', comentariosSchema);