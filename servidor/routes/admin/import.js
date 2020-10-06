var express = require('express');
var ExcelSrv = require('../../services/excel/export_excel_service')
var importExcelSrv = require('../../services/excel/import_excel_service')
var properties = require('../../utils/propertiesHelper');
var multer = require('multer')
var upload = multer({ dest: properties.get('nevado.server.import.folder') })
var AdmZip = require('adm-zip');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');

var routesImport = express.Router();

const excelMarcas = [
    { header: 'Marca' },
    { header: 'Foto' },
]
const excelCategorias = [
    { header: 'Categoria' }
]
const excelProductos = [
    { header: 'Codigo' },
    { header: 'Categoria' },
    { header: 'Marca' },
    { header: 'Modelo' },
    { header: 'Stock' },
    { header: 'PVP' },
    { header: 'Precio Tarifa' },
    { header: 'Caracteristicas' },
    { header: 'Otros' },
    { header: 'Estado' },
    { header: 'Imagen' },
]

const availableExcels = ['categoria', 'marca', 'producto']
const headers = [excelCategorias, excelMarcas, excelProductos]

routesImport.get('/template', passportConfig.isAuthenticated, async function (req, res, next) {

    let excel = req.query.template;
    if (excel == null) res.send("Error");
    if (!availableExcels.includes(excel)) res.send("Error");

    let wb = null
    let index = availableExcels.indexOf(excel);

    if (index > -1) {
        wb = ExcelSrv.exportTable(excel, headers[index]);
    }

    if (wb != null) wb.write('marcas.xlsx', res);
    else res.send("Error");
});

//https://www.npmjs.com/package/multer
routesImport.post('/upload', passportConfig.isAuthenticated, upload.single('file'), async function (req, res, next) {
    if (req.body.type == null || availableExcels.indexOf(req.body.type) < 0) {
        res.send({ error: 'invalid type' });
        return;
    }
    if (req.file.path == null) {
        res.send({ error: 'invalid file' });
        return;
    }
    let path = req.file.path.split("\\");
    let nombre = path[path.length - 1];

    importExcelSrv.importFile(req.body.type, nombre)
        .then(console.log("import terminado: " + req.body.type + "  " + req.file.path));

    res.send({ import: nombre });
});

routesImport.get('/getImportData', passportConfig.isAuthenticated, async function (req, res, next) {
    if (req.query.file == null) {
        res.send({ error: 'invalid file' });
        return;
    }
    let data = importExcelSrv.getImportData(req.query.file);
    if (data == null) {
        data = { error: 'invalid file' };
    }
    res.send(data);
});


module.exports = routesImport;