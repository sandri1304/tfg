var deHelper = require('../../utils/dbHelper');
var transports = require('../../modelos/transportes');
var transportsSrv = {};

transportsSrv.getTransports = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    
    if (params.name != null) {
        filters.nombre = { $regex : new RegExp(params.name, "i") } ;
    };

    return transports.paginate(filters, options);

};

module.exports = transportsSrv;