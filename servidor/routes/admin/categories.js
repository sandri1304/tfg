var express = require('express');
var categories = require('../../modelos/categorias');
var categoriesSrv = require('../../services/admin/categories_service');
var ExcelSrv = require('../../services/excel/export_excel_service');
var utils = require('../../utils/utils');
var routesCategories = express.Router();
var xl = require('excel4node');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');
var properties = require('../../utils/propertiesHelper');
var multer = require('multer')
var uploadImage = multer({ dest: properties.get('nevado.server.import.categories.folder') })
var fs = require('fs');

const excelMetadata = [
    {
        header: 'Nombre', 
        type: 'string', 
        field: 'nombre'
    },

    {
        header: 'Categoria General', 
        type: 'string', 
        field: 'categoriaGeneral'
    },
    
]

routesCategories.get('/Products', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await categoriesSrv.getCategoriesProducts();
    res.send(data);
});

routesCategories.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await categoriesSrv.getCategories(req.query);
    res.send(data);
});

routesCategories.post('/', passportConfig.isAuthenticated, uploadImage.single('file'), function(req, res, next){
    let category = {
        nombre: req.body.nombre,
        categoriaGeneral: req.body.categoriaGeneral
    }

    fs.rename(req.file.path, req.file.destination + req.body.nombre, function(err){
        if (err){
            res.send(213, "No se ha podido renombrar el fichero adjunto", true);
        }
    });

    let photoUrl = '/nevado/static/categories/' + req.body.nombre;
    category.imagen = photoUrl;

    if (category.nombre == null || category.nombre == "" || category.nombre == "undefined") {
        res.send(utils.getResponse(212, "Es necesario un nombre para la categoria", true));
        return;
    }

    if (category.categoriaGeneral == null || category.categoriaGeneral == "" || category.categoriaGeneral == "undefined") {
        res.send(utils.getResponse(212, "Es necesario un grupo de categoria para la categoria", true));
        return;
    }

    categories.create(category,function(e){
        if(e != null){
            response = utils.getResponse(211, "Error al crear la categoria en la base de datos", true);
        }else{
            response = utils.getResponse(200, "La categoria se ha guardado correctamente", false);
        }
        res.send(response);
    });
})

routesCategories.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
    req.query.pagination = false;
    var data = await categoriesSrv.getCategories(req.query);
    var wb = ExcelSrv.exportTable('categorias', excelMetadata, data);
    wb.write('categorias.xlsx', res);
});


routesCategories.delete('/:id', passportConfig.isAuthenticated, function(req, res, next){
    categories.deleteOne({'_id': req.params.id}, function(err){
        if(err) {
            response = utils.getResponse(211, "La categoría no se ha encontrado en nuestro sistema", true);
        } else {
            response = utils.getResponse(200, "Categoría borrada correctamente", false);
        }
        res.send(response);
    });
});

module.exports = routesCategories;