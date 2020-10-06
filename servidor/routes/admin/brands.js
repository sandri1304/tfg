var express = require('express');
var brands = require('../../modelos/marca');
var brandSrv = require('../../services/admin/brands_service');
var ExcelSrv = require('../../services/excel/export_excel_service');
var utils = require('../../utils/utils');
var routesBrands = express.Router();
var xl = require('excel4node');
var properties = require('../../utils/propertiesHelper');
var multer = require('multer')
var uploadImage = multer({ dest: properties.get('nevado.server.import.brands.folder') })
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

routesBrands.get('/Products', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await brandSrv.getBrandsProducts();
    res.send(data);
});

routesBrands.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await brandSrv.getBrands(req.query);
    res.send(data);
});

routesBrands.post('/', passportConfig.isAuthenticated, uploadImage.single('file'), function(req, res, next){
    let brand = {
        nombre: req.body.nombre,
    }

    fs.rename(req.file.path, req.file.destination + req.body.nombre, function(err){
        if (err){
            res.send(213, "No se ha podido renombrar el fichero adjunto", true);
        }
    });

    let photoUrl = properties.get('nevado.server.base.context') + properties.get('nevado.server.static.brands')+ '/' + req.body.nombre;
    brand.imagen = photoUrl;

    if (brand.nombre == null || brand.nombre == "" || brand.nombre == "undefined") {
        res.send(utils.getResponse(212, "Es necesario un nombre para la marca", true));
        return;
    }

    brands.create(brand,function(e){
        if(e != null){
            response = utils.getResponse(211, "Error al crear la marca en la base de datos", true);
        }else{
            response = utils.getResponse(200, "La marca se ha guardado correctamente", false);
        }
        res.send(response);
    });
})

routesBrands.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
    req.query.pagination = false;
    var data = await brandSrv.getBrands(req.query);
    var wb = ExcelSrv.exportTable('marcas', excelMetadata, data);
    wb.write('marcas.xlsx', res);
});

routesBrands.delete('/:id', passportConfig.isAuthenticated, function(req, res, next){
    brands.deleteOne({'_id': req.params.id}, function(err){
        if(err) {
            response = utils.getResponse(211, "La marca no se ha encontrado en nuestro sistema", true);
        } else {
            response = utils.getResponse(200, "Marca borrado correctamente", false);
        }
        res.send(response);
    });
});

module.exports = routesBrands;