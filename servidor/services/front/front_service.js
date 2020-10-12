var deHelper = require('../../utils/dbHelper');
var utilsHelper = require('../../utils/utils');
var product = require('../../modelos/articulos');
var offers = require('../../modelos/ofertas');
var clients = require('../../modelos/clientes');
var users  = require('../../modelos/usuarios');
var categories = require('../../modelos/categorias');
var brands = require('../../modelos/marca');
var payments = require('../../modelos/metodosPago');
var bills = require('../../modelos/facturas');
var frontSrv = {};

frontSrv.getTopVentas = async function () {
        let options = deHelper.getPagination({
                pageSize: 6,
                sort: 'ventas',
                order: 'desc'
        });
        options.populate = [{path: 'ofertas'}];
        return product.paginate({}, options);
};

frontSrv.getOfertas = async function () {
        let hoy = new Date();
        return await offers.find({
                fechaInicio: { $lte: hoy },
                fechaFin: { $gte: hoy }
        }, '_id').exec();
};

frontSrv.getArticulosConOfertas = async function (ids) {
        let options = deHelper.getPagination({
                pageSize: 6
        });
        options.populate = [{path: 'ofertas'}];
        return product.paginate({ ofertas: { $in: ids } }, options);
};

frontSrv.getCategories = async function (query) {
        let filters = {};
        if (query.name != null) {
                filters.categoriaGeneral = query.name;
        };

        return categories.find(filters);
};

frontSrv.getPayments = async function() {
        return payments.find();
};

frontSrv.getBrand = async function(query) {
        let filters =  {};
        if (query.name  != null) {
                filters.nombre = query.name;
        }
        return brands.findOne(filters);
}

frontSrv.getProductById = async function (req) {
        let id = req.params.idProduct;
        let productById = product.findById(id)
        .populate({path: 'comentarios'})
        .populate({path:'ofertas'})
        .catch((e)=>console.log(e));
        return productById; 
        
}

frontSrv.getProductsByCategory  = async function(query) {
        let filters  = {};
        if (query.category != null)  {
                filters.categoria = query.category;
        }
        if  (query.idProduct  != null) {
                filters._id = {$nin: query.idProduct}; 
        }

        let options = deHelper.getPagination({
                pageSize: 6,
                sort: 'ventas',
                order: 'desc'
        });
        options.populate = [{path: 'ofertas'}];
        return product.paginate(filters, options);
}


frontSrv.getProductsCategory  = async function(req, isCount) {
        let filters  = {};
        let params = {};

        let page;
        let limit;
        let  order;
        let hoy = new Date();
        let query = product.aggregate();


        let campos = {
                _id:"$_id",
                codigoArticulo:"$codigoArticulo",
                marca: "$marca",
                modelo: "$modelo",
                pvp:"$pvp",
                envioGratuito:"$envioGratuito",
                imagen:"$imagen",
                categoria: "$categoria",
                usuarios: "$usuarios",
                estrellas: "$estrellas",
                ofertas:'$offer',
                starRating:  {$divide:[ "$estrellas", {$cond: { if: { $gt: [ "$usuarios", 0 ] }, then: "$usuarios", else: 1 }}]},
                stock: '$stock',
                caracteristicas: '$caracteristicas',
                otros: '$otros',
                ventas: '$ventas',
                // descuento:  { $arrayElemAt: [ "$offer.descuento",0  ] },
                precioOrden: {
                        $cond: {
                                 if: 
                                        { $ne: ["$offer", [] ]},
                                        then:  { $subtract: [ "$pvp", {$multiply:["$pvp",  {$divide:[ { $arrayElemAt: [ "$offer.descuento",0  ] },100]}]} ] },
                                        else: "$pvp"
                                 
                        }
                }
        }
       
        if (req.params.nameCategory != null)  {
                query.match({categoria: req.params.nameCategory});;
        }
        if (req.query.stock != null && req.query.stock == "En Stock") {
                query.match({stock: { $gte: 1}});
        }

        if (req.query.feature != null) {
                query.match({caracteristicas: { $regex : new RegExp(req.query.feature, "i") } });
               // query.match({otros: { $regex : new RegExp(req.query.feature, "i") } });
        }

  
        if (req.query.brands != null) {
                let brands  = req.query.brands.split(',');
                if(brands.length > 0){
                        query.match({marca: {"$in" : brands}});
                }
        }
        query.lookup({
                from: 'ofertas',
                as: 'offer',
                let: { myId: '$ofertas' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$_id', '$$myId'] },
                          { $lte: ['$fechaInicio', hoy] },
                          { $gte: ['$fechaFin', hoy] }
                        ]
                      }
                    }
                  }
                ]
        });
        query.project(campos);
       
        
       

        if (req.query.offer != null && req.query.offer == "Con Oferta") {
                query.match({ofertas: { $ne: [] } });
        }
        if (req.query.min != null && utilsHelper.isFloat(req.query.min)) {
                let min = parseFloat(req.query.min);
                query.match({precioOrden: { $gte: min}});
        }
        if (req.query.max != null && utilsHelper.isFloat(req.query.max) ) {
                let max = parseFloat(req.query.max);
                query.match({precioOrden: { $lte: max}});
        }
        

        if (req.query.pageSize != null){
                limit = parseInt(req.query.pageSize);
        }

        if (req.query.pageIndex != null) {
                page = req.query.pageIndex - 1;
        }

        if (req.query.order != null) {
                if (req.query.order == 'asc') {
                        order = 1;
                } else {
                        order = -1;
                }
        }
        
        if (req.query.sort !=  null) {
                var sortM = {};
                sortM[req.query.sort]=order;
                query.sort(sortM);      
        }
        
        if(isCount){
                query.count("count");
        }else{

                query.skip(page*limit);
                query.limit(limit);
        }
      
        let prod = query.exec();
        return  prod;
}

frontSrv.getBrands = async function(req) {
        let category = req.query.category;
        let brands  = await product.aggregate([
                {$match: {categoria: category}},
                {$group:{
                       _id:"$marca"
                }
        }]);
        return brands;
}

frontSrv.getClientById = async function(id) {
        let client = clients.findById(id);
        return client;
}

frontSrv.getNumOrderClient = async function(id) {
        let orders = clients.findById(id).select('pedidos');
        return orders;
}

frontSrv.getUserEmail = async function(id){
        let filters = {};
        let options = {};
        filters._id = id;
        options.select = 'correo';
        let email = users.findById(id).select('correo');
        return email;
}

frontSrv.getUserconfirmation = async function(id){
        let filters = {};
        let options = {};
        filters._id = id;
        options.select = 'correo';
        let confirmation = users.findById(id).select('confirmacion');
        return confirmation;
}

frontSrv.getProducts = async function(ids) {
        return product.find({ _id: { $in: ids } }).populate('ofertas');
}

frontSrv.updateStockProduct= async function(id, stock, ventas) {
        var error =  false; 
        product.updateOne({'_id': id}, {stock: stock, ventas: ventas}, function (err, product) {
                if (err) {
                      return  this.error= true;
                } else {
                        return this.error;
                }
        })
}

frontSrv.getBills = async function() {
        let options = {

        }

        let query = bills.aggregate();

        let bill  = await bills.aggregate([
                {$sort:
                       { nFactura :  -1 }
                }
        ]);

        return bill;
        //return bills.find({}).sort('nFactura').order('asc');

}

frontSrv.getOrders  = async function(query, params) {
        console.log(query);
        console.log(params);
}
module.exports = frontSrv;