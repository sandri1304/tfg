var express = require('express');
var routes = express.Router();
var passport = require('passport');
var passportConfig = require('../config/passport.js');

var clients = require('../modelos/clientes.js');
var users = require('../modelos/usuarios.js');
var app = require('../app.js');
var routesOrders = require('./admin/orders.js');
//var routesDeliveryOrders = require('./admin/delivery_orders.js');
var routesInvoices = require('./admin/invoices.js');
var routesProducts = require('./admin/products.js');
var routesBrands = require('./admin/brands.js');
var routesCategories = require('./admin/categories.js');
var routesImport = require('./admin/import.js');
var routesClients = require('./admin/clients.js');
var routesOrders = require('./admin/orders.js');
var routesPaymentes = require('./admin/payments');
var routesTransports = require('./admin/transports.js');
var routesOffers = require('./admin/offers.js');
var routesMessages = require('./admin/messages.js')

var properties = require('../utils/propertiesHelper.js');


//app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/deliveryorders", routesDeliveryOrders);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/invoices", routesInvoices);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/products", routesProducts);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/brands", routesBrands);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/categories", routesCategories);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/import", routesImport);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/clients", routesClients);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/orders", routesOrders);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/payments", routesPaymentes);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/transports", routesTransports);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/offers", routesOffers);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context') + "/messages", routesMessages);


/*

routes.get('/clients', function (req, res) {
    var response = {
        code: 200
    }
    users.find({}, 'correo clientes', function (err, users) {
        if (!err) {
            clients.populate(users, { path: "clientes" }, function (err, useryclient) {
                if (!err) {
                    response.clients = useryclient;
                    response.count = useryclient.length;
                } else {
                    response.clients = [];
                    response.count = 0;
                    response.code = 211;
                }
                res.send(response);
            });
        } else {
            response.clients = [];
            response.count = 0;
            response.code = 211;

            res.send(response);
        }
    });

});


routes.get('/clients/:idUser', function(req, res) {

    let idUser = req.params.idUser;
    let idClient = req.query.idClient;

    var response = {
        code: 200
    };

    users.find({ '_id': idUser }, function (err, resDB) {
        if (!err) {
            clients.populate(resDB, { path: "clientes" }, function (err, client) {
                if (!err) {
                    clientRegistered = {
                        email: client[0].correo,
                        name: ((client[0].clientes.nombre == undefined) ? "" : client[0].clientes.nombre),
                        surname: ((client[0].clientes.apellidos == undefined) ? "" : client[0].clientes.apellidos),
                        phone: ((client[0].clientes.telefono == undefined) ? "" : client[0].clientes.telefono),
                        dni: ((client[0].clientes.dni == undefined) ? "" : client[0].clientes.dni),
                        billingAddress: ((client[0].clientes.direccionFactura == undefined) ? "" : client[0].clientes.direccionFactura),
                        sendAddress: ((client[0].clientes.direccionEnvio == undefined) ? "" : client[0].clientes.direccionEnvio),
                        birthday: ((client[0].clientes.fechaNacimiento == undefined) ? "" : client[0].clientes.fechaNacimiento.toISOString().substring(0, 10)),
                        orders: ((client[0].clientes.pedidos == undefined) ? 0 : client[0].clientes.pedidos),
                        discounts: ((client[0].clientes.descuentos == undefined) ? "No se aplica ningun descuento" : client[0].clientes.descuentos),
                        code: 200,
                        error: false,
                        message: "Informacion usuario/cliente",
                        idClient: client[0].clientes._id,
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
});*/

/*routes.delete('/clients/:idUser', function(req, res) {

    var response = {
        code: 200
    };
    let idUser = req.params.idUser;
    let idClient = req.query.idClient;
    let errorIdUser = false;
    let errorClient = false;

    users.deleteOne({ "_id": idUser }, function (err) {
        if (err) {
            errorIdUser = true;
            //response.message = "El cliente ha sido eliminado de la base de datos";
        }
    });

    clients.deleteOne({ "_id": idClient }, function (err) {
        if (err) {
            errorClient = true;
        }
    });

    if (errorClient || errorIdUser) {
        response.error = true;
        response.code = 211;
        response.message = "No se han podido borrar los datos del cliente";
    } else {
        response.error = true;
        response.message = "El cliente ha sido eliminado";
    }
    res.send(response);
})*/

/*routes.get('/admin/products',function(req, res){
    var response = {
        code: 200
    }
	res.send(response);
});	
*/
// routes.get('/*',passportConfig.isAuthenticated, function(req, res){
// 	res.sendFile('C:/Users/sandr/Dropbox/proyecto_v2/cliente/index.html');
// });	

/*routes.get('/*',function(req, res){
	res.sendFile('C:/Users/sandr/Dropbox/proyecto_v2/cliente/index.html');
});*/



module.exports = routes; 
