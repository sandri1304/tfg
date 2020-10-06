var deHelper = require('../../utils/dbHelper');
var users = require('../../modelos/usuarios');
var clients = require('../../modelos/clientes');
var clientsSrv = {};

clientsSrv.getUsers = async function (params) {

    let options = deHelper.getPagination(params);

    let filters = {};
    let filtersUser = {};
    
    if (params.name != null) {
        filters.nombre = { $regex : new RegExp(params.name, "i") } ;
    }

    if (params.subname != null) {
        filters.apellidos = { $regex : new RegExp(params.subname, "i") } ;
    }

    if (params.dni != null ) {
        filters.dni = { $regex : new RegExp(params.dni, "i") } ;
    }

    if (params.phone != null) {
        filters.telefono = { $regex : new RegExp(params.phone, "i") } ;
    }

    let ids;
    if (!(Object.keys(filters).length === 0 && filters.constructor === Object)) {
        let clientsFilters = await this.getClientsWithFilters(filters);
        ids = clientsFilters.map(clients => clients._id );
    } 

    if (params.email != null) {
        filtersUser.correo = { $regex : new RegExp(params.email, "i") } ;
    }

    if (ids != null){
        if(ids.length > 0){
         filtersUser.clientes = {$in : ids};
        }else{
            filtersUser.dni = -1;
        }
    }
    
    filtersUser.rol = {$ne: "admin"};
    options.populate ='clientes';
    options.select = '-contrasenia';
    return users.paginate(filtersUser, options);
}
    
clientsSrv.getClientsWithFilters = async function (filters) {
    return await clients.find(filters, '_id').exec();
}



module.exports = clientsSrv;