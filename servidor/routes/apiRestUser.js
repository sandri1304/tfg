var express = require('express');
var routes = express.Router();
var bcrypt = require("bcrypt"); // encriptado datos susceptibles

//Modelos base de datos mongo
var users = require('../modelos/usuarios.js');
var clients = require('../modelos/clientes.js');

//Funcionalidades
var emailHelper = require('../utils/emailHelpers.js');
var dateHelper = require('../utils/dateHelpers.js');
var passport = require('passport');
var passportConfig = require('../config/passport.js');
var utils = require('../../servidor/utils/utils');

routes.get('/:idUser',  function(req, res, next) {
    let idUser = req.params.idUser;
    let clientRegistered = {};

    users.find({'_id':idUser},function(err, resDB){
        if (!err) {
            clients.populate(resDB, {path: "clientes"},function(err, client){
                if (!err) {
                    clientRegistered = {
                        email: client[0].correo,
                        name: ((client[0].clientes.nombre == undefined) ? "" : client[0].clientes.nombre),
                        subname: ((client[0].clientes.apellidos == undefined) ? "" : client[0].clientes.apellidos),
                        phone: ((client[0].clientes.telefono == undefined) ? "" : client[0].clientes.telefono),
                        dni: ((client[0].clientes.dni == undefined) ? "" : client[0].clientes.dni),
                        billingAddress : ((client[0].clientes.direccionFactura == undefined) ? "" : client[0].clientes.direccionFactura),
                        sendAddress: ((client[0].clientes.direccionEnvio == undefined) ? "" : client[0].clientes.direccionEnvio),
                        birthday : ((client[0].clientes.fechaNacimiento == undefined) ? "" : client[0].clientes.fechaNacimiento.toISOString().substring(0,10)),
                        orders: ((client[0].clientes.pedidos == undefined) ? 0 : client[0].clientes.pedidos),
                        discount: ((client[0].clientes.descuentos == undefined) ? "No se aplica ningun descuento" : client[0].clientes.descuentos),
                        billingPostalCode : ((client[0].clientes.codigoPostalFactura == undefined) ? "" : client[0].clientes.codigoPostalFactura),
                        billingTown: ((client[0].clientes.puebloFactura == undefined) ? "" : client[0].clientes.puebloFactura),
                        province: ((client[0].clientes.provinciaFactura == undefined) ? "" : client[0].clientes.provinciaFactura),
                        postalCode2: ((client[0].clientes.codigoPostalEnvio == undefined) ? "" : client[0].clientes.codigoPostalEnvio),
                        sendTown: ((client[0].clientes.puebloEnvio == undefined) ? "" : client[0].clientes.puebloEnvio),
                        sendProvince: ((client[0].clientes.provinciaEnvio == undefined) ? "" : client[0].clientes.provinciaEnvio),
                        code: 200, 
                        error: false,
                        message: "Informacion usuario/cliente", 
                        idClient:client[0].clientes._id, 
                        idUser: idUser
                    }
                } else {
                    clientRegistered = {
                        code: 211,
                        error: true, 
                        message: "no se ha podido recuperar la informacion del cliente"
                    }
                }
                res.send(clientRegistered);
                
            }); 
        } else {
            clientRegistered = {
                code: 211,
                error: true, 
                message: "no se ha podido recuperar la informacion del usuario"
            } 
            res.send(clientRegistered);
        }
	});
});

routes.post('/:idUser', function(req, res, next){
    var obj = {};

    if(req.body.birthday != null && req.body.birthday != ""){
        var d = new Date(req.body.birthday) ;
        if(d != null && d != "Invalid "){
            obj.fechaNacimiento = d;
        };
    }

    obj.nombre = req.body.name;
    obj.apellidos = req.body.subname;
    obj.telefono = req.body.phone;
    obj.dni = req.body.dni;
    obj.direccionFactura = req.body.billingAddress;
    obj.codigoPostalFactura = req.body.billingPostalCode;
    obj.puebloFactura  = req.body.billingTown;
    obj.provinciaFactura = req.body.province;
    obj.direccionEnvio = req.body.sendAddress;
    obj.codigoPostalEnvio = req.body.postalCode2;
    obj.provinciaEnvio = req.body.sendProvince;
    obj.puebloEnvio = req.body.sendTown;
    obj.pedidos = req.body.orders;
    obj.descuentos = req.body.discount;


    clients.updateOne({'_id': req.body.idClient}, obj, function (err, user) {
        if (err) {
            response = utils.getResponse(211, true, "No se han podido guardar los datos del cliente. Inténtelo de nuevo más tarde.");
        } else {
            response = utils.getResponse(200, false, "Los datos del cliente se han guardado correctamente");
            
        }
        res.send(response);
    
    });
})

module.exports = routes;