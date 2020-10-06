var express = require('express');
var albaran = require('../../modelos/facturas');
var articulo = require('../../modelos/articulos');
var DOSrv = require('../../services/admin/delivery_order_service');
var ExcelSrv = require('../../services/excel/export_excel_service')
var routesDeliveryOrders = express.Router();
var xl = require('excel4node');

    ///https://www.npmjs.com/package/mongoose-paginate-v2

const excelMetadata = [
    {
        header:'Nº Albaran',
        type: 'number',
        field: 'nalbaran'
    },
    {
        header:'Fecha',
        type: 'date',
        field: 'fecha'
    },
    {
        header:'Cliente',
        type: 'string',
        field: 'cliente'
    }
] 

routesDeliveryOrders.get('/', async function (req, res, next) {
    var data = await DOSrv.getAlbaranes(req.query);
    res.send(data);
})

routesDeliveryOrders.get('/export', async function (req, res, next) {
    req.query.pagination = false;
    var data = await DOSrv.getAlbaranes(req.query);
    var wb = ExcelSrv.exportTable('albaranes', excelMetadata, data);
    wb.write('Albaranes.xlsx', res);
})

routesDeliveryOrders.get('/:id', async function (req, res, next) {
   // let id = "5e2766987e64581d588fc6fc";

    let id = req.params.id;
    if(id == null) res.send({});
  
    let albaran = await DOSrv.getAlbaranById(id).catch(()=>console.log("Cannot find albaran " + id));
    if(albaran==null){
        res.send({});
        return;
    }
    let albCompleto =  await DOSrv.populateAlbaran(albaran);
    res.send(albCompleto);
})




//querys ejemplo
//
//
//

function albaranFactory(nalbaran, fecha, cliente, articulo){
    var a = new albaran();
    a.nalbaran = nalbaran;
    a.fecha = fecha;
    a.cliente = cliente;
    a.articulos = [articulo];
    return a;
}
function guardaAlbaran(albaran) {
    albaran.save(function(e){
        if(e){
          
            console.error('Error guardando albaran: ' + albaran);
            
        }else{
            console.log('Creado nuevo albaran: ' + albaran);
        }
    });
}


function borrarAlbaran(){
    albaran.remove({cliente:'paco'},function(e){
        if(e) console.error(e);
        console.log('Albaran borrado: ' + albaran);
    })
}

function actualizarAlbaran(){
    albaran.updateMany({cliente:'pedro'}).where({cliente:'alex'}).exec(function(e,total,albaranes){
        if(e)console.error(e);
        console.log('updated: ' + total + ' ' + albaranes) ;
    })
}
function actualizarUnAlbaran(){
    albaran.updateOne({cliente:'alex'}).where({nalbaran:1}).exec(function(e,total,albaranes){
        if(e)console.error(e);
        console.log('updated: ' + total + ' ' + albaranes) ;
    })
}

function dameArticulo(code){
    var a = new articulo();
    a.codigoArticulo = code;
    a.categoria = 'chinpun';
    a.modelo = 'BCD2345';
    return a;
}

function crearTodo(articulo){
    articulo.save(function(e){
        if(e){
            console.error(e);
            console.error('Error guardando articulo: ' + articulo);
        }else{
            console.log('Creado nuevo articulo: ' + articulo);
            console.log(articulo._id);

            let al=  albaranFactory(44,new Date(), 'alex', articulo._id);
            guardaAlbaran(al);
        }
    });
}

function crearTodo2(articulo){
    // let a1 = dameArticulo('12');
    // let a2 = dameArticulo('23');
    
    //let art = [a1,a2];
    let al=  albaranFactory2(25,new Date(), 'alex');
    //al.save();
   
    let a1 = dameArticulo('123');
    let a2 = dameArticulo('234');
    al.articulos.create(a1);
    al.articulos.create(a2);
    al.save();
}


function albaranFactory2(nalbaran, fecha, cliente, articulo){
    var a = new albaran();
    a.nalbaran = nalbaran;
    a.fecha = fecha;
    a.cliente = cliente;
    a.articulos = [];
    return a;
}

module.exports = routesDeliveryOrders;
