var deHelper = require('../../utils/dbHelper');
var product = require('../../modelos/articulos');
var ProSrv = {};

ProSrv.getProducts = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    
    if (params.codeProduct != null) {
        filters.codigoArticulo = { $regex : new RegExp(params.codeProduct, "i") } ;
    }

    if (params.category != null) {
        filters.categoria = { $regex : new RegExp(params.category, "i") } ;
    }

    if (params.brand != null ) {
        filters.marca = { $regex : new RegExp(params.brand, "i") } ;
    }

    if (params.price != null) {
        filters.pvp = params.price;
    }

    return product.paginate(filters, options);

};


ProSrv.getProductById = async function (id) {
    return product.findById(id)
                .select('-estrellas')
                .select('-comentarios')
                .select('-usuarios');
};

ProSrv.populateProduct = async function (prod) {
    var opts = [{ path: 'articulos' }];
    return product.populate(prod, opts);
};

ProSrv.populateOfferProduct = async function (prod) {
    var opts = [{ path: 'ofertas' }];
    return product.populate(prod, opts);
};

module.exports = ProSrv;