var deHelper = require('../../utils/dbHelper');
var invoices = require('../../modelos/facturas');
var users  = require('../../modelos/usuarios');
var clients = require('../../modelos/clientes');
var products = require('../../modelos/articulos');
var invoicesSrv = {};

invoicesSrv.getInvoices = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    let filterUser = {};
    if (params.nInvoice != null) {
        filters.nFactura = params.nInvoice;
    }
    if (params.date != null) {
        filters.fecha = {
            $gte: new Date(new Date(params.date).setHours(00, 00, 00)),
            $lt: new Date(new Date(params.date).setHours(23, 59, 59))
        }
    }
    /*if (params.client != null) {
        filters.cliente = { $regex : new RegExp(params.client, "i") } ;
    }*/

    if (params.client != null) {
        filterUser.correo = { $regex : new RegExp(params.client, "i") } ;
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
            filters.cliente = id;
        }else{
            filters.nFactura = -1;
        }
    }

    options.populate = [{path: 'cliente', select: 'correo'}];
    return invoices.paginate(filters, options);

};

invoicesSrv.getInvoicesById = async function (id) {
    return invoices.findById(id);
};

invoicesSrv.populateInvoice = async function (inv) {
    var opts = [{ path: 'articulos' }];
    return invoices.populate(inv, opts);
};

invoicesSrv.getOrdersProducts = async function (params) {
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

    let data = products.paginate(filters,options);
    return data;
}

invoicesSrv.getInvoicesProducts = async function (params) {
    let params2 = {
        page: params.page,
        pageSize: params.pageSize
    };

    let filters = {};

    let ids = [];
    if (params != null) {
        ids = params.split(",");
    };
    
    if(ids.length > 0){
        filters._id = {$in : ids};
    }else{
           filters.marca = -1;
    }

    //options.populate = 'ofertas';
    let data = products.find(filters).populate('ofertas');
    return data;
}

invoicesSrv.getClient = async function (param) {
    return users.findById(param).select('email');
}

invoicesSrv.getUserWithFilters =  async function(filters) {
    return await users.find(filters, '_id').exec();
}

invoicesSrv.getInvoiceByIdOrder = async function(filters) {
    let filter =  {};

    if(filters.idPedido  != null) {
        filter.idPedido = filters.idPedido;
    }

    return await invoices.find(filter).exec();
}

invoicesSrv.getClientData = async function (filter) {
    console.log(filter);
    let user =await users.findById(filter).select('clientes');
    return client = await clients.findById(user.clientes._id);
}





module.exports = invoicesSrv;