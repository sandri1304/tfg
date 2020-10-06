var express = require('express');
var messages = require('../../modelos/mensajes');

var utils = require('../../utils/utils');

var routesMessages = express.Router();
var passport = require('passport');
var passportConfig = require('../../config/passport.js');
var xl = require('excel4node');
var ExcelSrv = require('../../services/excel/export_excel_service');
var messageSrv = require('../../services/admin/messages_service');
var emailHelper = require('../../utils/emailHelpers');


const excelMetadata = [
    {
        header: 'Nombre  Usuario', 
        type: 'string', 
        field: 'nombreUsuario'
    },
    {
        header:'Correo Usuario',
        type: 'string',
        field: 'correoUsuario'
    },
    {
        header:'Mensaje',
        type: 'string',
        field: 'mensaje'
    },
    {
        header:'Fecha Envio',
        type: 'date',
        field: 'fecha'
    }
]

routesMessages.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await messageSrv.getMessages(req.query);
    res.send(data);
});

routesMessages.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
    req.query.pagination = false;
    var data = await messageSrv.getMessages(req.query);
    var wb = ExcelSrv.exportTable('mensajes', excelMetadata, data);
    wb.write('mensajes.xlsx', res);
});

routesMessages.delete('/:id', passportConfig.isAuthenticated, function(req, res, next){
    messages.deleteOne({'_id': req.params.id}, function(err){
        if(err) {
            response = utils.getResponse(211, "El mensaje no se ha podido eliminar", true);
        } else {
            response = utils.getResponse(200, "Mensaje eliminado correctamente", false);
        }
        res.send(response);
    });
});

routesMessages.post('/send', passportConfig.isAuthenticated, function(req, res, next){
    console.log(req.body);
    emailHelper.sendMsg("sandra_ag10@hotmail.com", req.body.answerSend, "Respuesta pregunta enviada");
    let response = utils.getResponse(200, "Mensaje enviado correctamente", false);
    res.send(response);
});

routesMessages.post('/:id', passportConfig.isAuthenticated, function(req, res, next){
    if (req.body.leido  == "true" || req.body.leido) {
        req.body.leido = true;
    } else {
        req.body.leido =  false;
    }
    messages.updateOne({'_id': req.params.id}, {$set: {leido: req.body.leido}}, function (err, user) {
		if (err) {
			response = utils.getResponse(211, "El mensaje no se ha podido actualizar ", true);
		} else {
			response = utils.getResponse(200, "El mensaje se ha actualizado correctamente", false);
		}
		res.send(response);
	})
});





module.exports = routesMessages;