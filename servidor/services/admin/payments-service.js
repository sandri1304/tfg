var deHelper = require('../../utils/dbHelper');
var payment = require('../../modelos/metodosPago');
var paymentsSrv = {};

paymentsSrv.getPayments = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    
    if (params.name != null) {
        filters.nombre = { $regex : new RegExp(params.name, "i") } ;
    };

    return payment.paginate(filters, options);

};

module.exports = paymentsSrv;