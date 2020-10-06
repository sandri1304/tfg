var express = require('express');
var orders = require('../../modelos/pedidos');
var products = require('../../modelos/articulos');
var user = require('../../modelos/usuarios');
var ordersSrv = require('../../services/admin/orders_service');
var ExcelSrv = require('../../services/excel/export_excel_service');
var xl = require('excel4node');
var utils = require('../../utils/utils');
var routesOrders = express.Router();
var passport = require('passport');
var passportConfig = require('../../config/passport.js');
const { options } = require('../front/apiRestFront');

const excelMetadata = [
    {
        header: 'Id. Pedidos', 
        type: 'string', 
        field: 'idPedido'
    },
    {
        header:'Estado',
        type: 'string',
        field: 'estado'
    },
    {
        header:'Fecha de entrada',
        type: 'date',
        field: 'fechaEntrada'
    },
    {
        header:'Fecha de entrega',
        type: 'date',
        field: 'fechaEntrega'
    }, 
    {
        header: 'Cliente', 
        type: 'string', 
        field: 'usuarios'
    },
    {
      header: 'Productos', 
      type: 'string', 
      field: 'articulos'
    },
    {
      header: 'Total', 
      type: 'number', 
      field: 'total'
    },
    {
      header: 'Direccion Factura', 
      type: 'string', 
      field: 'direccionFactura'
    }
]

routesOrders.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    var data = await ordersSrv.getOrders(req.query);
    res.send(data);
});

routesOrders.get('/products', passportConfig.isAuthenticated, async function(req, res, next) {
    var data = await ordersSrv.getOrdersProducts(req.query);
    res.send(data);
});

routesOrders.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
    req.query.pagination = false;
    let data = await ordersSrv.getOrders(req.query);
    let data2 = [];
    for (i = 0; i< data.items.length; i++) {
        let copyItems = Object.assign({},data.items[i]._doc);
        delete copyItems.articulos;
        delete copyItems.usuarios;
        let articulos = [];
        for(j=0; j<data.items[i].articulos.length; j++) {
            articulos.push(data.items[i].articulos[j].codigoArticulo);
        }
       copyItems.articulos = articulos.toString();
       copyItems.usuarios = data.items[i].usuarios.correo;
       data2.push(copyItems);
        
    }

    data.items = data2;
    console.log(data);
    let wb = ExcelSrv.exportTable('pedidos', excelMetadata, data);
    wb.write('pedidos.xlsx', res);
 }); 

 routesOrders.post('/:id', passportConfig.isAuthenticated, function(req, res, next) {
    console.log(req.params.id);
    console.log(req.body.estado);
    // if(req.body.cobrado != null) {
    //     let cobrado = (req.body.cobrado == 'true') ? true: false;
    //     orders.updateOne({'_id': req.params.id}, {$set :{cobrado: cobrado}}, function (err, order) {
    //         if (err) {
    //             response = utils.getResponse(211, "El pedido no se ha actualizado correctamente", true);
    //         } else {
    //             response = utils.getResponse(200, "El pedido se ha actualizado correctamente", false);
    //         }
    //         //res.send(response);
    //     })
    // }

    
    orders.updateOne({'_id': req.params.id}, {$set :{estado: req.body.estado}}, function (err, order) {
		if (err) {
			response = utils.getResponse(211, "El pedido no se ha actualizado correctamente", true);
		} else {
			response = utils.getResponse(200, "El pedido se ha actualizado correctamente", false);
		}
		res.send(response);
    })
    
    
 });

 routesOrders.post('/cobrado/:id', passportConfig.isAuthenticated, function(req, res, next) {
    //console.log(req.params.id);
    if(req.body.cobrado != null) {
        let cobrado = (req.body.cobrado == 'true') ? true: false;
        orders.updateOne({'_id': req.params.id}, {$set :{cobrado: cobrado}}, function (err, order) {
            if (err) {
                response = utils.getResponse(211, "El pedido no se ha actualizado correctamente", true);
            } else {
                response = utils.getResponse(200, "El pedido se ha actualizado correctamente", false);
            }
            res.send(response);
        })
    }
});


 routesOrders.get('/pending', passportConfig.isAuthenticated, function(req, res, next) {
     orders.countDocuments({estado: { $regex : new RegExp('Pendiente', "i") }}, function (err, orderCount){
         if (err) {
             res.send("error");
         } else {
             res.send(orderCount.toString());
         }
     })
 })

module.exports = routesOrders;