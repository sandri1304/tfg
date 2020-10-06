var express = require('express');
var products = require('../../modelos/articulos');
var ProSrv = require('../../services/admin/products_service');
var ExcelSrv = require('../../services/excel/export_excel_service');
var utils = require('../../utils/utils');
var routesProducts = express.Router();
var properties = require('../../utils/propertiesHelper');
var multer = require('multer')
var uploadImage = multer({ dest: properties.get('nevado.server.import.products.folder') })
var fs = require('fs');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');

const excelMetadata = [
    {
        header: 'Código', 
        type: 'string', 
        field: 'codigoArticulo'
    },
    {
        header:'Categoria',
        type: 'string',
        field: 'categoria'
    },
    {
        header:'Modelo',
        type: 'string',
        field: 'modelo'
    },
    {
        header:'Marca',
        type: 'string',
        field: 'marca'
    }, 
    {
        header: 'PVP', 
        type: 'number', 
        field: 'pvp'
    },
    {
        header: 'PVP Tarifa', 
        type: 'number', 
        field: 'pvpTarifa'
    },
    {
        header: 'Características', 
        type: 'string', 
        field: 'caracteristicas'
    },
    {
        header: 'Otras Características', 
        type: 'string', 
        field: 'otros'
    },
    {
        header: 'Fecha publicación', 
        type: 'string', 
        field: 'fechaPublicacion'
    },
    {
        header: 'Fecha modificación', 
        type: 'string', 
        field: 'fechaModificacion'
    }
    
]


routesProducts.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
   req.query.pagination = false;
   var data = await ProSrv.getProducts(req.query);
   var wb = ExcelSrv.exportTable('productos', excelMetadata, data);
   wb.write('productos.xlsx', res);
})


routesProducts.get('/:id', passportConfig.isAuthenticated, async function (req, res, next) {
    // let id = "5e2766987e64581d588fc6fc";
 
    let id = req.params.id;
    if(id == null) res.send({});
   
    let product = await ProSrv.getProductById(id).catch(()=>console.log("Cannot find product " + id));
    if(product==null){
        res.send({});
        return;
    }

    let prodComplet =  await ProSrv.populateProduct(product);
    let prod = await ProSrv.populateOfferProduct(prodComplet);
    res.send(prod);
});

routesProducts.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    let data = await ProSrv.getProducts(req.query);
    res.send(data);
})

routesProducts.post('/:id', passportConfig.isAuthenticated, uploadImage.single('file'), async function(req, res, next) {
    let product = createObjProduct(req);
    
    

    fs.rename(req.file.path, req.file.destination + req.body.codigoArticulo, function(err){
        if (err){
            res.send(213, "No se ha podido renombrar el fichero adjunto", true);
        }
    });

    let photoUrl = '/nevado/static/products/' + req.body.codigoArticulo;
    product.imagen = photoUrl;

    var d = new Date() ;
    if (d != null && d != "Invalid") {
        product.fechaModificacion = d;
    }

    if (!utils.isInt(product.stock)) {
        res.send(utils.getResponse(212, "El dato introducido en el stock tiene formato incorrecto", true));
        return;
    }

    if (!utils.isFloat(product.pvp)) {
        res.send(utils.getResponse(212, "El dato introducido en el PVP tiene formato incorrecto", true));
        return;
    }

    if (!utils.isFloat(product.pvpTarifa)) {
        res.send(utils.getResponse(212, "El dato introducido en el PVP de tarifa tiene formato incorrecto", true));
        return;
    }

    let productDB = await products.findOne({'_id': req.params.id});
    product.estrellas = productDB.estrellas;
    product.usuarios = productDB.usuarios;
    product.ventas = productDB.ventas;
    product.comentarios = productDB.comentarios;

    products.updateOne({'_id': req.params.id}, product, function (err, user) {
		if (err) {
			response = utils.getResponse(211, "El producto no se ha encontrado en nuestro sistema", true);
		} else {
			response = utils.getResponse(200, "El producto se ha actualizado correctamente", false);
		}
		res.send(response);
	})
})

routesProducts.delete('/:id', passportConfig.isAuthenticated, function(req, res, next){
    products.deleteOne({'_id': req.params.id}, function(err){
        if(err) {
            response = utils.getResponse(211, "El producto no se ha encontrado en nuestro sistema", true);
        } else {
            response = utils.getResponse(200, "Producto borrado correctamente", false);
        }
        res.send(response);
    });
});

routesProducts.post('/', passportConfig.isAuthenticated, uploadImage.single('file'), function(req, res, next){
    let product = createObjProduct(req);
    product.comentarios= [];

    fs.rename(req.file.path, req.file.destination + req.body.codigoArticulo, function(err){
        if (err){
            res.send(213, "No se ha podido renombrar el fichero adjunto", true);
        }
    });

    let photoUrl = '/nevado/static/products/' + req.body.codigoArticulo;
    product.imagen = photoUrl;

    var d = new Date() ;
    if (d != null && d != "Invalid") {
        product.fechaModificacion = d;
        product.fechaPublicacion = d;
    }

    if (!utils.isInt(product.stock)) {
        res.send(utils.getResponse(212, "El dato introducido en el stock tiene formato incorrecto", true));
        return;
    }

    if (!utils.isFloat(product.pvp)) {
        res.send(utils.getResponse(212, "El dato introducido en el PVP tiene formato incorrecto", true));
        return;
    }

    if (!utils.isFloat(product.pvpTarifa)) {
        res.send(utils.getResponse(212, "El dato introducido en el PVP de tarifa tiene formato incorrecto", true));
        return;
    }

    products.create(product,function(e){
        if(e != null){
            response = utils.getResponse(211, "Error al crear el producto en la base de datos", true);
        }else{
            response = utils.getResponse(200, "El producto se ha guardado correctamente", false);
        }
        res.send(response);
    });
})

function createObjProduct(req) {
    let product = {
        codigoArticulo: req.body.codigoArticulo,
        categoria: req.body.categoria,
        modelo: req.body.modelo,
        marca: req.body.marca,
        pvpTarifa: req.body.pvpTarifa,
        pvp: req.body.pvp,
        estado: (req.body.estado != null && req.body.estado != "") ? req.body.estado : false,
        stock: req.body.stock,
        caracteristicas: req.body.caracteristicas,
        otros: req.body.otros,
        autor: req.body.autor,
        envioGratuito: (req.body.envioGratuito != null && req.body.envioGratuito != "") ? req.body.envioGratuito : false,
        estrellas: req.body.estrellas,
        usuarios: req.body.usuarios,
        comentarios: req.body.comentarios,
        ventas: req.body.ventas
    }

    if (req.body.oferta != null && req.body.oferta != "") {
        product.ofertas = req.body.oferta;
    }

    return product;
}





module.exports = routesProducts;