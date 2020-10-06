var deHelper = require('../../utils/dbHelper');
var categories = require('../../modelos/categorias');
var categoriesSrv = {};

categoriesSrv.getCategoriesProducts = async function () {
    return categories.find({}, function(err, categories) {

    });
};

categoriesSrv.getCategories = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    
    if (params.name != null) {
        filters.nombre = { $regex : new RegExp(params.name, "i") } ;
    };

    return categories.paginate(filters, options);

};


categoriesSrv.getCategoriesImport = async function () {
    return categories.find({}, function(err, categories) {

    });
};


module.exports = categoriesSrv;