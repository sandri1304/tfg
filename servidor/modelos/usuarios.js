var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
BCRYPT_SALT_ROUNDS = 10;
const mongoosePaginate = require('mongoose-paginate-v2');

var usuariosSchema = new Schema({
	correo: {type:String, required: true, index: {unique:true}},
	nombre: String,
	rol: String,
	bloqueado: Boolean,
	confirmacion: Boolean,
	expira: Date,
	intentosFallidos: Number,
	contrasenia: {type: String, required:true},
	notificaciones: Boolean,
	clientes: { type: Schema.ObjectId, ref: "clientes" }
}, {
	timestamps:true,
});

usuariosSchema.pre('save', function(next){
	var usuario  = this;
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			next(err);
		} 
		bcrypt.hash(usuario.contrasenia, salt, (err, hash) =>{
			if(err) {
				next(err);
			} else {
				usuario.contrasenia = hash;
				next();
			}

		});
	});
});

usuariosSchema.methods.comparePassword = function(password, callback) {
	bcrypt.compare(password, this.contrasenia, (err, isEquals) => {
		if (err) {
			return callback(err);
		}
		callback(null, isEquals);
	});
};

usuariosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('usuarios', usuariosSchema);