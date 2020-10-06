var XLSX = require('xlsx');
var fs = require('fs');
var AdmZip = require('adm-zip');

var properties = require('../../utils/propertiesHelper.js');
var marcas = require('../../modelos/marca');
var categorias = require('../../modelos/categorias');
var articulos = require('../../modelos/articulos');
var brandSrv = require('../../services/admin/brands_service');
var categorySrv = require('../../services/admin/categories_service');


var ImportSrv = {};

var importaciones = {};


//https://github.com/cthackers/adm-zip
//https://github.com/SheetJS/sheetjs
ImportSrv.importFile = async function (type, file) {

    if (isAlreadyRunning(type)) {
        console.error("ya se esta importando un fichero de ese tipo");
        return;
    }

    var res = {
        file: file,
        type: type,
        status: 'working',
        log: []
    }
    importaciones[file] = res;
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            try {

                switch (type) {
                    case 'categoria':
                        importCategorias(file, res, resolve);
                        break;
                    case 'marca':
                        importMarcas(file, res, resolve);
                        break;
                    case 'producto':
                        importProductos(file, res, resolve);
                        break;
                    default:
                        res.log.push("Tipo de importacion invalido");
                        break;
                }

            } catch (err) {
                reject(Error(err));
            }
        }, 1);
    });

};

ImportSrv.getImportData = function (file) {
    let importacion = importaciones[file];
    if (importacion != null && importacion.status == 'finished') {
        delete importaciones[file];
    }
    return importacion;
}

function isAlreadyRunning(type) {
    let files = Object.keys(importaciones);
    let running = files.filter(k => { return importaciones[k].type == type });
    if (running.length > 0) return true;
    return false;
}

function importMarcas(file, res, resolve) {
    let invalidData = []
    let log = res.log;
    let nombreExcel = "marca.xlsx";

    var zip = new AdmZip(properties.get('nevado.server.import.folder') + file);
    zip.extractEntryTo(nombreExcel, properties.get('nevado.server.import.folder'), false, true);

    var workbook = XLSX.readFile(properties.get('nevado.server.import.folder') + nombreExcel);
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var data = XLSX.utils.sheet_to_json(worksheet);
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        if (data[i]['Marca'] == null || data[i]['Foto'] == null) {
            log.push("Línea " + (i + 2) + ": Dato no válido");
            invalidData.push(i);
        } else {
            try {
                zip.extractEntryTo(data[i]['Foto'], properties.get('nevado.server.import.brands.folder'), false, true);
                data[i].imagen = properties.get('nevado.server.base.context') + properties.get('nevado.server.static.brands')+ '/' +data[i]['Foto']; // /nevado/static/brands/
                data[i].nombre = data[i]['Marca'];
            } catch (err) {
                log.push("Línea " + (i + 2) + ": Foto no válida");
                invalidData.push(i);
            }

        }
    }
    for (let i = 0; i < invalidData.length; i++) {
        delete data[invalidData[i]];
    }

    marcas.insertMany(data, { ordered: false }, function (error, inserted) {
        if (error) {
            if(error.writeErrors != null){
                let marcas = error.writeErrors.map(m => { return m.err.op.nombre });
                log.push("Error al guardar. Marcas duplicadas: " + marcas);
            }else{
                log.push("Error al guardar. Marcas duplicadas: " + error.err.op.nombre);
            }
     
            if (error.result.nInserted > 0) {
                log.push("Se han importado " + error.result.nInserted + " registros");
            }
        }
        if (inserted) {
            log.push("Se han importado " + inserted.length + " registros");
        }
        log.push("Importación finalizada");
        res.status = 'finished';
        resolve("Ok");
    })
}


function importCategorias(file, res, resolve) {
    let invalidData = []
    let log = res.log;
    let nombreExcel = "categoria.xlsx";

    var zip = new AdmZip(properties.get('nevado.server.import.folder') + file);
    zip.extractEntryTo(nombreExcel, properties.get('nevado.server.import.folder'), false, true);

    var workbook = XLSX.readFile(properties.get('nevado.server.import.folder') + nombreExcel);
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var data = XLSX.utils.sheet_to_json(worksheet);
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        if (data[i]['Categoria'] == null || data[i]['Foto'] == null || data[i]['Categoria General'] == null  ) {
            log.push("Línea " + (i + 2) + ": Dato no válido");
            invalidData.push(i);
        }else if  (data[i]['Categoria General'] == null || !checkCategorie(data[i]['Categoria General'])) {
            log.push("Línea " + (i + 2) + ": Dato no válido");
            invalidData.push(i);
            
        } else {
            zip.extractEntryTo(data[i]['Foto'], properties.get('nevado.server.import.categories.folder'), false, true);
            data[i].nombre = data[i]['Categoria'];
            data[i].imagen = properties.get('nevado.server.base.context') + properties.get('nevado.server.static.categories')+ '/' + data[i]['Foto'];
            data[i].categoriaGeneral = data[i]['Categoria General'];
        }
    }
    for (let i = 0; i < invalidData.length; i++) {
        delete data[invalidData[i]];
    }

    categorias.insertMany(data, { ordered: false }, function (error, inserted) {
        if (error) {
            if(error.writeErrors != null){
                let categorias = error.writeErrors.map(m => { return m.err.op.nombre });
                log.push("Error al guardar. Categorías duplicadas: " + categorias);
            } else{
                log.push("Error al guardar. Categorías duplicadas: " + error.err.op.nombre);
            }
            
            if (error.result.nInserted > 0) {
                log.push("Se han importado " + error.result.nInserted + " registros");
            }
        }

        

        if (inserted) {
            log.push("Se han importado " + inserted.length + " registros");
        }
        log.push("Importación finalizada");
        res.status = 'finished';
        resolve("Ok");
    })
}


function productoIsValid(data, log, rowNum, marcas, categorias) {
    let valid = true;
    if (data['Codigo'] == null) {
        valid = false;
        log.push("Línea " + rowNum + ": Código no válido")
    }
    if (data['Categoria'] == null || categorias.indexOf(data['Categoria']) < 0) {
        valid = false;
        log.push("Línea " + rowNum + ": Categoría no válida")
    }
    if (data['Marca'] == null || marcas.indexOf(data['Marca']) < 0) {
        valid = false;
        log.push("Línea " + rowNum + ": Marca no válida")
    }
    if (data['Modelo'] == null) {
        valid = false;
        log.push("Línea " + rowNum + ": Modelo no válido")
    }
    if (data['Stock'] == null || typeof (data['Stock']) != 'number' || !Number.isInteger(data['Stock'])) {
        valid = false;
        log.push("Línea " + rowNum + ": Stock no válido")
    }
    if (data['PVP'] == null | typeof (data['PVP']) != 'number') {
        valid = false;
        log.push("Línea " + rowNum + ": PVP no válido")
    }
    if (data['Precio Tarifa'] == null | typeof (data['Precio Tarifa']) != 'number') {
        valid = false;
        log.push("Línea " + rowNum + ": Precio Tarifa no válido")
    }
    if (data['Caracteristicas'] == null) {
        valid = false;
        log.push("Línea " + rowNum + ": Caracteristicas no válidas")
    }
    if (data['Imagen'] == null) {
        valid = false;
        log.push("Línea " + rowNum + ": Imágen no válida")
    }
    return valid;
}

function rellenarProducto(data, zip) {
    zip.extractEntryTo(data['Imagen'], properties.get('nevado.server.import.products.folder'), false, true);

    data.codigoArticulo = data['Codigo'] + '';
    data.categoria = data['Categoria'];
    data.marca = data['Marca'];
    data.modelo = data['Modelo'];
    data.stock = data['Stock'];
    data.pvp = data['PVP'];
    data.pvpTarifa = data['Precio Tarifa'];
    data.caracteristicas = data['Caracteristicas'];
    data.otros = data['Otros'];
    data.estado = (data['Estado'] == 'Si') ? true : false;
    data.imagen = properties.get('nevado.server.base.context') +  properties.get('nevado.server.static.products') + '/' + data['Imagen'];
    data.fechaModificacion = new Date();
    data.fechaPublicacion = new Date();
    data.autor = 'Import'
}

function checkCategorie(category) {
    let categories = ['Gran Electrodoméstico', 'Pequeño electrodoméstico de cocina', 'Imagem', 'Sonido', 'Telefonía y electrónica', 'Cuidado Personal', 'Limpieza', 'Climatización', 'Informática'];
    let find = false;

    for (let i = 0; i <categories.length; i++) {
        if (categories[i] == category) {
            find = true;
        }
    }
    return find;
}

async function importProductos(file, res, resolve) {
    let invalidData = []
    let log = res.log;
    let nombreExcel = "producto.xlsx";

    var zip = new AdmZip(properties.get('nevado.server.import.folder') + file);
    zip.extractEntryTo(nombreExcel, properties.get('nevado.server.import.folder'), false, true);

    let marcas = await brandSrv.getBrandsImport();
    marcas = marcas.map(m => { return m.nombre });
    let categorias = await categorySrv.getCategoriesImport();
    categorias = categorias.map(c => { return c.nombre });

    var workbook = XLSX.readFile(properties.get('nevado.server.import.folder') + nombreExcel);
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var data = XLSX.utils.sheet_to_json(worksheet);
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        if (!productoIsValid(data[i], log, i + 2, marcas, categorias)) {
            invalidData.push(i);
        } else {
            try {
                rellenarProducto(data[i], zip);

            } catch (err) {
                log.push("Línea " + (i + 2) + ": Imágen no válida");
                invalidData.push(i);
            }

        }
    }
    for (let i = 0; i < invalidData.length; i++) {
        delete data[invalidData[i]];
    }

    articulos.insertMany(data, { ordered: false }, function (error, inserted) {
        if (error) {
            if(error.writeErrors != null) {
                let art = error.writeErrors.map(a => { return a.err.op.codigoArticulo });
                log.push("Error al guardar. Artículos duplicados: " + art);
            }else{
                log.push("Error al guardar. Artículos duplicados " + error.err.op.nombre);
            }

            if (error.result.nInserted > 0) {
                log.push("Se han importado " + error.result.nInserted + " registros");
            }
            
        }
        if (inserted) {
            log.push("Se han importado " + inserted.length + " registros");
        }
        log.push("Importación finalizada");
        res.status = 'finished';
        resolve("Ok");
    })
}



module.exports = ImportSrv;