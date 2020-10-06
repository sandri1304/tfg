var express = require('express');
var offers = require('../../modelos/ofertas');
var offersSrv = require('../../services/admin/offers_service');
var ExcelSrv = require('../../services/excel/export_excel_service');
var utils = require('../../utils/utils');
var routesOffers = express.Router();
var xl = require('excel4node');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');




const excelMetadata = [
    {
        header: 'Id. Oferta', 
        type: 'string', 
        field: 'idOferta'
    },
    {
        header:'% Descuento',
        type: 'number',
        field: 'descuento'
    },
    {
        header:'Fecha de Inicio',
        type: 'date',
        field: 'fechaInicio'
    },
    {
        header:'Fecha de Fin',
        type: 'date',
        field: 'fechaFin'
    }, 
    {
        header: 'Descripción', 
        type: 'string', 
        field: 'descripcion'
    }
]

routesOffers.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await offersSrv.getOffers(req.query);
    res.send(data);
});

routesOffers.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
    req.query.pagination = false;
    var data = await offersSrv.getOffers(req.query);
    var wb = ExcelSrv.exportTable('ofertas', excelMetadata, data);
    wb.write('ofertas.xlsx', res);
});

routesOffers.delete('/:id', passportConfig.isAuthenticated, function(req, res, next){
    offers.deleteOne({'_id': req.params.id}, function(err){
        if(err) {
            response = utils.getResponse(211, "La oferta no se ha encontrado en nuestro sistema", true);
        } else {
            response = utils.getResponse(200, "Oferta borrada correctamente", false);
        }
        res.send(response);
    });
});

routesOffers.post('/', passportConfig.isAuthenticated, function(req, res, next){
    let offer = createObjOffer(req);

    if (!utils.isInt(offer.descuento)) {
        res.send(utils.getResponse(212, "El dato introducido en el stock tiene formato incorrecto", true));
        return;
    }

    offers.create(offer,function(e){
        if(e != null){
            response = utils.getResponse(211, "Error al crear la oferta en la base de datos", true);
        }else{
            response = utils.getResponse(200, "La oferta se ha guardado correctamente", false);
        }
        res.send(response);
    });
})

routesOffers.post('/:id', passportConfig.isAuthenticated, function(req, res, next){
    let offer = createObjOffer(req);
    console.log(req);

    if (!utils.isInt(offer.descuento)) {
        res.send(utils.getResponse(212, "El dato introducido en el stock tiene formato incorrecto", true));
        return;
    }

    offers.updateOne({'_id': req.params.id}, offer, function (err, user) {
		if (err) {
			response = utils.getResponse(211, "La oferta no se ha encontrado en nuestro sistema", true);
		} else {
			response = utils.getResponse(200, "La oferta se ha actualizado correctamente", false);
		}
		res.send(response);
	});
});

routesOffers.get('/Products', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await offersSrv.getOffersProducts();
    res.send(data);
});

function createObjOffer(req) {
    let offer = {
        idOferta: req.body.idOferta,
        descuento: req.body.descuento,
        fechaInicio: new Date(req.body.fechaInicio),
        fechaFin: new Date(req.body.fechaFin),
        descripcion: req.body.descripcion
    }
    return offer;
}

module.exports = routesOffers;