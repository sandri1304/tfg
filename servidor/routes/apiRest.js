var express = require('express');
var routes = express.Router();
var bcrypt = require("bcrypt"); // encriptado datos susceptibles

var usuarios = require('../modelos/usuarios.js');
var clientes = require('../modelos/clientes.js');
var emailHelper = require('../utils/emailHelpers.js');
var dateHelper = require('../utils/dateHelpers.js');
var passport = require('passport');
var passportConfig = require('../config/passport.js');
var properties = require('../utils/propertiesHelper.js');
// var sandra =require('../modelos/user.js').model('myuser');

routes.get('/test2', function(req, res){
	usuarios.updateOne({'_id': '5d4afdbd1a6323215c90b5a5'}, {clientes: '5d4afdbd1a6323215c90b5a5'}, function (err, user) {
		if (err) {
			console.log("Error: Usuario no confirmado. La actualizacion en DB erronea"); 
		} else {
			console.log("Ok: Usuario confirmado. Ya puede acceder a la aplicacion");
		}
		res.send('ok');
	})
});

routes.post('/register', function(req, res){
	var response = {};
	var cliente = new clientes();
	var error = false;
	var users = {
		'correo': req.body.username,
		'rol': 'cliente',
		'bloqueado': false,
		'confirmacion': false,
		'notificaciones': (req.body.publicity == true) ? true : false,
		'contrasenia': req.body.password,
		'intentosFallidos' : 0, 
		'expira' : dateHelper.dateExpire(),
		'clientes' : cliente
	}

	cliente.save(function(err, client) {
		if (err) {
			this.error = true;
		};
	});

	if (!error) {
		usuarios.findOne({'correo': req.body.username}, function (err, resDB) {
			if (err) {
				response = {      /////////////////-------------------
					error: true,
					code: 500,
					message: "Se ha producido un error inesperado en la aplicación. Intentelo de nuevo",
				};
			} else {
				if (resDB == null) {
					usuarios.create(users,function(error,user) {
						if (error != null) {
						} else {
							let message = "<p>Este mensaje es generado automaticamente. Si tiene algun problema póngase en contacto con nevado.proyecto.19@gmail.com</p><p>Bienvenido a la tienda Online Nevado</p><p>Para completar el registro haga click <a href=\""+properties.get('nevado.server.hostname')+"/register/" + user._id + "\">aquí</a></p><p>Un saludo.</p><p>Nevado</p>"

							let reason = "Registro tienda online Nevado";
							emailHelper.sendMsg("sandra_ag10@hotmail.com", message, reason);
							response= {
								error: false,
								code: 200,
								message: "guardado en la base de datos",
							};
							res.send(response);
						}	
					});	
				} else {
					response = {
						error: false,
						code: 210,
						message: "Usuario registrado, inténtelo con otro email",
					};
					res.send(response);
				}
			}
		});
	} else {
		response = {
			error: true,
			code: 500,
			message: "Se ha producido un error inesperado en la aplicación. Intentelo de nuevo",
		}
	}
	
});

routes.post('/register/:idUser', function(req, res){
	let response = {};
	usuarios.updateOne({'_id': req.params.idUser}, {confirmacion: true}, function (err, user) {
		if (err) {
			response = {
				code:  211,
				error: true,
				message: "Usuario no encontrado en nuestro sistema"
			};
			console.log("Error: Usuario no confirmado. La actualizacion en DB erronea"); 
		} else {
			response = {
				code: 200, 
				error: false, 
				message: "Usuario confirmado"
			};
			console.log("Ok: Usuario confirmado. Ya puede acceder a la aplicacion");
		}
		res.send(response);
	})

});

routes.post('/login', function(req, res, next){
	var response = {};

	passport.authenticate('local', (err, user, info) => {
		if(err) {
			next(err);
		}
		if(!user) {
			response = {
				error: true,
				code: 211,
				urlRedirect: "/login",
				message:"Email o contraseña inválidos"
			};
			res.send(response);
		} else {
			req.logIn(user, (err) =>{
				if (err) {
					next(err);
				}
				response = {
					error: false, 
					code: 200,
					showCart: (user.rol == "cliente") ? true : false,
					urlRedirect: (user.rol == "cliente") ? "/home" : "/admin",
					userName: user.correo,
					id: user._id,
					message: "login exitoso"
				};
				res.send(response);
			});
		};
	})(req, res, next);
});

routes.get('/logout', passportConfig.isAuthenticated, function(req, res, next) {
	req.logout();
	var response = {
		error: false, 
		code: 200, 
		message: "logout exitoso"
	};
	res.send(response);
});

routes.get('/forgetPassword/:email', function(req, res, next){
	var response = {};
	var error = false;
	usuarios.findOne({'correo': req.params.email}, function (err, resDB) {
		if (err) {
			respuesta = {
				error: true,
				code: 500,
				message: "Se ha producido un error inesperado en la aplicación. Intentelo de nuevo",
			};
		} else {
			if (err != null) {
				response = {
					error: false,
					code: 210,
					message: "Se ha producido un error ",
				};
			} else {
				if (resDB != null) {
					let message = "<p>Para completar la modificaci&oacute;n de la contrase&ntilde;a pulse en el siguiente enlace:</p><p><a href=\""+properties.get('nevado.server.hostname')+"/forgetPassword/" + resDB.id + "\"></a>\""+properties.get('nevado.server.hostname')+"/forgetPassword/" + resDB.id + "\"</p><p>Este mensaje se ha generado autom&aacute;ticamente al hacer la petici&oacute;n de cambio de contrase&ntilde;a. Por favor, no responda a este correo. Para cualquier problema contacte con el servicio t&eacute;cnico a trav&eacute;s del siguiente correo: nevado.proyecto.19@gmail.com.</p><p>Un saludo.</p><p>Nevado</p>"
					let reason = "Modifcación contraseña";
					emailHelper.sendMsg("sandra_ag10@hotmail.com", message, reason);
					response= {
						error: false,
						code: 200,
						message: "Se ha mandado un correo al email introducido",
					}
				} else {
					response = {
						error: false,
						code: 210,
						message: "El usuario no se encuentra en la aplicacion ",
					}
				}
			}	
			res.send(response);
		}	
	});
});


routes.post('/forgetPassword/:idUser', function(req, res, next){
	let response = {};
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			next(err);
		} 
		bcrypt.hash(req.body.password, salt, (err, hash) =>{
			if(err) {
				next(err);
			} else {
				usuarios.updateOne({'_id': req.body.username}, {contrasenia: hash}, function (err, user) {
					if (err) {
						response = {
							code:  211,
							error: true,
							message: "Se ha producido un error al actualizar la contraseña. Inténtalo de nuevo."
						};
						console.log("Error: Usuario no confirmado. La actualizacion en DB erronea"); 
					} else {
						response = {
							code: 200, 
							error: false, 
							message: "La contraseña ha sido actualizada"
						};
						console.log("Ok: Usuario confirmado. Ya puede acceder a la aplicacion");
					}
					res.send(response);
					
				})
			}

		});
	});
});

module.exports = routes;