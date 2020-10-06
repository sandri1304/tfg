const pdf = require('html-pdf');
var properties = require('../utils/propertiesHelper.js');



var pdfHelper = {};

pdfHelper.createPdf = function(content, fileName) {
    console.log("creando fichero:   " + properties.get('nevado.server.invoices')+"/" +  fileName);
	pdf.create(content).toFile(properties.get('nevado.server.invoices')+"/" +  fileName+".pdf", function(err, res) {
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    });
};

module.exports = pdfHelper;




