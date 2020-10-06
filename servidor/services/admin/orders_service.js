var deHelper = require('../../utils/dbHelper');
var orders = require('../../modelos/pedidos');
var products = require('../../modelos/articulos');
var user = require('../../modelos/usuarios');

var ordersSrv = {};

ordersSrv.getOrders = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    let filterUser = {};

    if (params.idOrders != null) {
        filters.idPedido = { $regex : new RegExp(params.idOrders, "i") } ;
    }

    if (params.status != null) {
        filters.estado = params.status;
    }

    if (params.entryDate != null) {
        filters.fechaEntrada = {
            $gte: new Date(new Date(params.entryDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(params.entryDate).setHours(23, 59, 59))
        }
    }
    if (params.email != null) {
        filterUser.correo = { $regex : new RegExp(params.email, "i") } ;
    }

    let id;
    if (!(Object.keys(filterUser).length === 0 && filterUser.constructor === Object)) {
        let userFilter = await this.getUserWithFilters(filterUser);
        if(userFilter.length > 0){
            id = userFilter[0]._id;
        }else{
            id = "invalid_value"
        }
    }

    if (id != null){
        if (id != "invalid_value"){
            filters.usuarios = id;
        }else{
            filters.idPedido = -1;
        }
    }

    options.populate = [{path: 'usuarios', select: 'correo'},
                        {path: 'articulos.articulo', select: 'codigoArticulo'}];

    return orders.paginate(filters, options);

};

ordersSrv.getUserWithFilters =  async function(filters) {
    return await user.find(filters, '_id').exec();
}

ordersSrv.getOrdersProducts = async function (params) {
    let params2 = {
        page: params.page,
        pageSize: params.pageSize
    };

    let options = deHelper.getPagination(params2);
    let filters = {};

    let ids = [];
    if (params.ids != null) {
        ids = params.ids.split(",");
    };
    
    if(ids.length > 0){
        filters._id = {$in : ids};
    }else{
           filters.marca = -1;
    }

    options.populate = [{path: 'ofertas'}];
    let data = products.paginate(filters,options);
    return data;
}


module.exports = ordersSrv;