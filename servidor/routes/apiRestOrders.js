var express = require('express');

var emailHelper = require('../utils/emailHelpers.js');
var dateHelper = require('../utils/dateHelpers.js');
var passport = require('passport');
var passportConfig = require('../config/passport.js');
var utils = require('../../servidor/utils/utils');
var ordersSrv = require('../services/ordersClient/orderClient_service');


var routesOrders = express.Router();


//Modelos base de datos mongo
/*var users = require('../modelos/usuarios.js');
var clients = require('../modelos/clientes.js');

var orders = require('../../modelos/pedidos');*/

//Funcionalidades


//http://localhost:8080/nevado/orders/test
routesOrders.get('/test', function (req, res, next) {
    res.send("OK");
});


routesOrders.get('/:idUser', passportConfig.isAuthenticated, async function(req,res, next){
    var data = await ordersSrv.getOrders(req.query, req.params);
    res.send(data);
});

module.exports = routesOrders;