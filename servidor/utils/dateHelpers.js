var dateHelper = {};

dateHelper.dateExpire = function() {
	var hoy = Date.now();
	var expiracion = 365 * 24 * 60 * 60 * 1000;
	var fechaExpiracion = hoy + expiracion;
	return new Date(fechaExpiracion); 
};

module.exports = dateHelper;