#!/usr/bin/env node

var app = require('./app');

app.set('port', process.env.PORT || 8080);

// Corremos servidor
var server = app.listen(app.get('port'), function() {
	console.log('El servidor esta corriendo en el puerto ' + server.address().port);
});