var deHelper = require('../../utils/dbHelper');
var albaran = require('../../modelos/facturas');
var DOSrv = {};

DOSrv.getAlbaranes = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    if (params.nalbaran != null) {
        filters.nalbaran = params.nalbaran;
    }
    if (params.fecha != null) {
        filters.fecha = {
            $gte: new Date(new Date(params.fecha).setHours(00, 00, 00)),
            $lt: new Date(new Date(params.fecha).setHours(23, 59, 59))
        }
    }
    if (params.cliente != null) {
        filters.cliente = params.cliente;
    }
    return albaran.paginate(filters, options);

};


DOSrv.getAlbaranById = async function (id) {
    return albaran.findById(id);
};

DOSrv.populateAlbaran = async function (alb) {
    var opts = [{ path: 'articulos' }];
    return albaran.populate(alb, opts);
};

module.exports = DOSrv;