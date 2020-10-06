var deHelper = require('../../utils/dbHelper');
var offers = require('../../modelos/ofertas');
var offersSrv = {};

offersSrv.getOffers = async function (params) {

    let options = deHelper.getPagination(params);
    let filters = {};
    
    if (params.idOffers != null) {
        filters.idfOferta = params.idOffers;
    };
    if (params.discount  != null) {
        filters.descuento = params.discount;
    }
    if (params.initDate != null) {
        filters.fechaInicio = {
            $gte: new Date(new Date(params.initDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(params.initDate).setHours(23, 59, 59))
        }
    }

    if (params.endDate != null) {
        filters.fechaFin = {
            $gte: new Date(new Date(params.endDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(params.endDate).setHours(23, 59, 59))
        }
    }

    return offers.paginate(filters, options);

};

offersSrv.getOffersProducts = async function () {
    return offers.find({}, function(err, categories) {

    });
};


module.exports = offersSrv;