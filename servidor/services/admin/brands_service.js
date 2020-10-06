var deHelper = require('../../utils/dbHelper');
var brand = require('../../modelos/marca');
var brandSrv = {};

brandSrv.getBrandsProducts = async function () {
    return brand.find({}, function(err, brands) {
    });
};

brandSrv.getBrands = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    
    if (params.name != null) {
        filters.nombre = { $regex : new RegExp(params.name, "i") } ;
    };

    return brand.paginate(filters, options);

};

brandSrv.getBrandsImport = async function () {
    return brand.find({}, function(err, brands) {

    });
};

module.exports = brandSrv;