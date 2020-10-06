var PropertiesReader = require('properties-reader');
var path = require('path');
var properties = PropertiesReader(path.join(__dirname, '../config/nevadoServer.properties')); //haciendo esto solo leo el fichero de properties una vez.

module.exports = properties;

