var express = require('express');
var payments = require('../../modelos/metodosPago');
var paymentsSrv = require('../../services/admin/payments-service');
var ExcelSrv = require('../../services/excel/export_excel_service');
var utils = require('../../utils/utils');
var routesPayments = express.Router();
var xl = require('excel4node');
var properties = require('../../utils/propertiesHelper');
var multer = require('multer')
var uploadImage = multer({ dest: properties.get('nevado.server.import.payments.folder') })
var fs = require('fs');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');

const excelMetadata = [
    {
        header: 'Nombre', 
        type: 'string', 
        field: 'nombre'
    },
    
]

routesPayments.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await paymentsSrv.getPayments(req.query);
    res.send(data);
});

routesPayments.post('/', passportConfig.isAuthenticated, uploadImage.single('file'), function(req, res, next){
    let payment = {
        nombre: req.body.nombre
    }

    fs.rename(req.file.path, req.file.destination + req.body.nombre, function(err){
        if (err){
            res.send(213, "No se ha podido renombrar el fichero adjunto", true);
        }
    });

    let photoUrl = '/nevado/static/payments/' + req.body.nombre;
    payment.imagen = photoUrl;

    if (payment.nombre == null || payment.nombre == "" || payment.nombre == "undefined") {
        res.send(utils.getResponse(212, "Es necesario un nombre para el método de pago", true));
        return;
    }

    payments.create(payment,function(e){
        if(e != null){
            response = utils.getResponse(211, "Error al crear el método de pago en la base de datos", true);
        }else{
            response = utils.getResponse(200, "El método de pago se ha guardado correctamente", false);
        }
        res.send(response);
    });
})

routesPayments.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
    req.query.pagination = false;
    var data = await paymentsSrv.getPayments(req.query);
    var wb = ExcelSrv.exportTable('pagos', excelMetadata, data);
    wb.write('pagos.xlsx', res);
});

routesPayments.delete('/:id', passportConfig.isAuthenticated, function(req, res, next){
    payments.deleteOne({'_id': req.params.id}, function(err){
        if(err) {
            response = utils.getResponse(211, "El método de pago no se encuentre en nuestro sistema", true);
        } else {
            response = utils.getResponse(200, "El método de pago se ha borrado correctamente", false);
        }
        res.send(response);
    });
});

module.exports = routesPayments;