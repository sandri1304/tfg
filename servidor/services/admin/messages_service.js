var deHelper = require('../../utils/dbHelper');
var messages = require('../../modelos/mensajes');
var messageSrv = {};

messageSrv.getMessages = async function (params) {
    let options = deHelper.getPagination(params);

    let filters = {};

    if (params.name != null) {
        filters.nombreUsuario = { $regex : new RegExp(params.name, "i") } ;
    }

    if (params.email != null) {
        filters.correoUsuario = { $regex : new RegExp(params.email, "i") } ;
    }

    if (params.date != null) {
        filters.fecha = {
            $gte: new Date(new Date(params.date).setHours(00, 00, 00)),
            $lt: new Date(new Date(params.date).setHours(23, 59, 59))
        }
    }

    if (params.read != null) {
        if (params.read == "false") {
            filters.read = { "$in": ["false",false] };
        } else {
            filters.read = { "$in": ["true",true] };
        }
    }

    return messages.paginate(filters, options);
}

module.exports = messageSrv;