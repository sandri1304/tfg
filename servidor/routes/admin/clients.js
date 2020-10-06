var express = require('express');
var clients = require('../../modelos/clientes.js');
var users = require('../../modelos/usuarios.js');
var clientsSrv = require('../../services/admin/clients_service');
var ExcelSrv = require('../../services/excel/export_excel_service');
var utils = require('../../utils/utils');
var routesClients = express.Router();
var xl = require('excel4node');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');

const excelMetadata = [
  {
      header: 'Nombre', 
      type: 'string', 
      field: 'nombre'
  },
  {
      header:'Apellidos',
      type: 'string',
      field: 'apellidos'
  },
  {
      header:'Email',
      type: 'string',
      field: 'correo'
  },
  {
      header:'DNI',
      type: 'string',
      field: 'dni'
  }, 
  {
      header: 'Teléfono', 
      type: 'string', 
      field: 'telefono'
  },
  {
    header: 'Pedidos', 
    type: 'Number', 
    field: 'pedidos'
  },
  {
    header: 'Direccion Envio', 
    type: 'string', 
    field: 'direccionEnvio'
  },
  {
    header: 'Direccion Factura', 
    type: 'string', 
    field: 'direccionFactura'
  }
]


routesClients.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await clientsSrv.getUsers(req.query);
    res.send(data);
});

routesClients.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
  req.query.pagination = false;
  var data = await clientsSrv.getUsers(req.query);
  data = data.items.map( i => {
    let copyItem = Object.assign({},i._doc);
    if(copyItem.clientes == null) {
      return copyItem;
    }
    let copyClient = Object.assign({},copyItem.clientes._doc);
    delete copyClient._id;
    delete copyItem.clientes;
    let transformed = {...copyClient,...copyItem};
    return transformed;
  });

  var wb = ExcelSrv.exportTable('usuarios', excelMetadata, {items: data});
  wb.write('usuarios.xlsx', res);
});

routesClients.delete('/:idUser', passportConfig.isAuthenticated, function(req, res){
  let idUser = req.params.idUser;
  let idClient = req.query.idClient;
  let errorIdUser = false;
  let errorClient = false;

  users.deleteOne({"_id": idUser}, function(err) {
    if (err) {
        errorIdUser = true;
    }
  });

  clients.deleteOne({"_id": idClient}, function (err){
    if (err) {
        errorClient = true;
    }
  });

  if (errorClient || errorIdUser) {
    response = utils.getResponse(211, "No se han podido borrar los datos del cliente", true);
  } else {
    response = utils.getResponse(200, "El cliente se ha borrado correctamente de su base de datos", false);
  }
  res.send(response);
});

module.exports = routesClients;