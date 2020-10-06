var express = require('express');
var transports = require('../../modelos/transportes');
var tranportsSrv = require('../../services/admin/transports-service');
var ExcelSrv = require('../../services/excel/export_excel_service');
var utils = require('../../utils/utils');
var routesTransports = express.Router();
var xl = require('excel4node');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');

const excelMetadata = [
    {
        header: 'Nombre', 
        type: 'string', 
        field: 'nombre'
    },
    
]

routesTransports.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await tranportsSrv.getTransports(req.query);
    res.send(data);
});

routesTransports.post('/', passportConfig.isAuthenticated, function(req, res, next){
    let transport = {
        nombre: req.body.nombre,
    }

    if (transport.nombre == null || transport.nombre == "" || transport.nombre == "undefined") {
        res.send(utils.getResponse(212, "Es necesario un nombre para la empresa de transporte", true));
        return;
    }

    transports.create(transport,function(e){
        if(e != null){
            response = utils.getResponse(211, "Error al crear la empresa de transporte en la base de datos", true);
        }else{
            response = utils.getResponse(200, "La empresa de transporte se ha guardado correctamente", false);
        }
        res.send(response);
    });
})

routesTransports.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
    req.query.pagination = false;
    var data = await tranportsSrv.getTransports(req.query);
    var wb = ExcelSrv.exportTable('transportes', excelMetadata, data);
    wb.write('transportes.xlsx', res);
});

routesTransports.delete('/:id', passportConfig.isAuthenticated, function(req, res, next){
    transports.deleteOne({'_id': req.params.id}, function(err){
        if(err) {
            response = utils.getResponse(211, "La empresa de transporte no se encuentre en nuestro sistema", true);
        } else {
            response = utils.getResponse(200, "La empresa de transporte se ha borrado correctamente", false);
        }
        res.send(response);
    });
});

module.exports = routesTransports;