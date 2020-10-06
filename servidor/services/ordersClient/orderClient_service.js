
var deHelper = require('../../utils/dbHelper');
var utilsHelper = require('../../utils/utils');
var orders = require('../../modelos/pedidos');


var ordersSrv = {};
ordersSrv.getOrders = async function (query, params) {

    let options = deHelper.getPagination(query);
    let filters = {};
    

    if (query.idOrders != null) {
        filters.idPedido = { $regex : new RegExp(query.idOrders, "i") } ;
    }

    if (query.status != null) {
        filters.estado = query.status;
    }

    if (query.entryDate != null) {
        filters.fechaEntrada = {
            $gte: new Date(new Date(query.entryDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(query.entryDate).setHours(23, 59, 59))
        }
    }

    filters.usuarios = params.idUser;
    
    return orders.paginate(filters, options);

}

module.exports = ordersSrv;