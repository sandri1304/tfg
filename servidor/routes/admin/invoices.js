var express = require('express');
var invoices = require('../../modelos/facturas');
var products = require('../../modelos/articulos');
var invoiceSrv = require('../../services/admin/invoice_service');
var ExcelSrv = require('../../services/excel/export_excel_service')
var routesInvoices = express.Router();
var xl = require('excel4node');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');
var utils = require('../../utils/utils');
var properties = require('../../utils/propertiesHelper');
var pdf = require('../../utils/pdfCreator');


const excelMetadata = [
    {
        header:'Nº Factura',
        type: 'number',
        field: 'nFactura'
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
routesInvoices.get('/test', function (req, res, next) {
    var damelodelabd = 'esto viene de la bd';
    pdf.createPdf(`
        <h1>Título en el PDF creado con el ${damelodelabd} paquete html-pdf</h1>
        <p>Generando un PDF con un HTML sencillo</p>
        `+ damelodelabd + "sigue el pdf por aqui");
    res.send("OK");
}); 

routesInvoices.get('/', passportConfig.isAuthenticated, async function (req, res, next) {
    var data = await invoiceSrv.getInvoices(req.query);
    res.send(data);
});

routesInvoices.get('/products', passportConfig.isAuthenticated, async function(req, res, next) {
    var data = await invoiceSrv.getInvoicesProducts(req.query);
    res.send(data);
});

routesInvoices.get('/client', passportConfig.isAuthenticated, async function(req, res, next) {
    console.log(req.query.idUser);
    var data = await invoiceSrv.getClient(req.query.idUser);
    res.send(data);
});

routesInvoices.get('/export', passportConfig.isAuthenticated, async function (req, res, next) {
    req.query.pagination = false;
    var data = await invoiceSrv.getInvoices(req.query);
    var wb = ExcelSrv.exportTable('facturas', excelMetadata, data);
    wb.write('Facturas.xlsx', res);
});

routesInvoices.post('/pedido', passportConfig.isAuthenticated, async function (req, res, next) {

    let findIdPedido  = false;
    let query = invoices.aggregate();

    let bill  = await invoices.aggregate([
            {$sort:
                   { nFactura :  -1 }
            }
    ]);

    for (let i=0; i < bill.length; i++) {
        if (bill[i].idPedido == req.body.idPedido) {
            findIdPedido = true;
            response = utils.getResponse(211, "La factura ya existe", true);
            res.send(response);
        }
    }

    if (!findIdPedido) {
        let nInvoice;
        let invoice =  new invoices();
        let fecha  = new Date();
        if (bill.length == 0) {
            nInvoice =  1;
        } else {
            nInvoice = bill[0].nFactura + 1;
        }

        invoice.nFactura = nInvoice;
        invoice.cliente = req.body.usuarios._id;
        invoice.idPedido = req.body.idPedido;
        invoice.articulos = req.body.articulos;
        invoice.fecha = fecha;
        invoice.total = req.body.total; 
        let error;

        invoice.save(function(err, order) {
            if (err) {
                response = utils.getResponse(211, "No se ha podido crear la factura", true);
            } else {
                response  = utils.getResponse(200, "La factura se ha creado correctamente", false);
            };
            res.send(response);
        });
        
    }
});

routesInvoices.post('/pdf', passportConfig.isAuthenticated, async function (req, res, next) {
    console.log(req.body);
    console.log(req.body.cliente._id);
    let client = await invoiceSrv.getClientData(req.body.cliente._id);
    let ids; 
    for (let i = 0; i < req.body.articulos.length; i++ ) {
        if(i==0) {
            ids  = req.body.articulos[i].articulo;
        } else {
            ids  = ids + ',' + req.body.articulos[i].articulo; 
        }
    }
    let products = await invoiceSrv.getInvoicesProducts(ids);
    let content =  createPdfInvoice(req.body, client, products);
    pdf.createPdf(content, req.body.nFactura);
    let response = utils.getResponse(200, properties.get('nevado.server.invoices')+"/" +  req.body.nFactura, false);
    res.send(response);

});

routesInvoices.get('/:id', passportConfig.isAuthenticated, async function (req, res, next) {
 
     let id = req.params.id;
     if(id == null) res.send({});
   
     let invoice = await invoiceSrv.getInvoicesById(id).catch(()=>console.log("Cannot find Invoice " + id));
     if(invoice==null){
         res.send({});
         return;
     }
     let InvoiceComplet =  await invoiceSrv.populateInvoice(invoice);
     res.send(InvoiceComplet);
})

function invoiceFactory(nFactura, fecha, cliente, articulo){
    var a = new invoices();
    a.nFactura = nFactura;
    a.fecha = fecha;
    a.cliente = cliente;
    a.articulos = [articulo];
    return a;
}

function saveInvoice(invoice) {
    invoices.save(function(e){
        if(e){
          
            console.error('Error guardando factura: ' + invoice);
            
        }else{
            console.log('Creado nuevo factura: ' + invoice);
        }
    });
}

function removeInvoice(){
    invoices.remove({cliente:'paco'},function(e){
        if(e) console.error(e);
        console.log('factura borrado: ');
    })
}

function createPdfInvoice(req, client, products) {
    let nameClient = client.nombre;
    let subnameClient = client.apellidos;
    let addressInvoice  = client.direccionFactura;
    let provinceInvoice  = client.provinciaFactura;
    let codePostalInvoice = client.codigoPostalFactura;
    let phone = client.telefono;
    let fecha = new Date(req.fecha);
    let date = (fecha.getDate().toString().length == 1) ? "0" + fecha.getDate() : fecha.getDate();
    let month = ((fecha.getMonth() + 1).toString().length == 1) ? "0" + (fecha.getMonth() + 1) :  fecha.getMonth() + 1;
    let fechaFormat =  date + "/" + month + "/" + fecha.getFullYear();
    let nInvoice  = req.nFactura;
    const content = `<h1 style="padding-left: 25px; color: #224E8F; font-weight: bold; font-size: 48px" >Nevado</h1>
                    <div>
                    <div>
                        <p><span style="padding-left: 25px; padding-right: 60px">C\\Parvillas Altas, 36</span><span style="margin-left: 420px">FECHA: ${fechaFormat} </span></p>
                        <p><span style="padding-left: 25px; padding-right: 60px"">Madrid, 28021</span><span style="margin-left: 450px">FACTURA ${nInvoice}</span></p>
                        <p style="padding-left: 25px">645734356 
                        </div>
                    </div>
                    <div style="margin-top: 60px; margin-bottom: 60px;">
                        <p style="padding-left: 25px;">FACTURAR A: </p>
                        <p style="padding-left: 25px;">${nameClient} ${subnameClient} </p>
                        <p style="padding-left: 25px;">${addressInvoice}</p>
                        <p style="padding-left: 25px;">${provinceInvoice} ${codePostalInvoice}</p>
                        <p style="padding-left: 25px;">${phone}</p>
                    </div>  
                    <div>
                        <table style="padding-left: 25px; width: 100%;">
                            <tr style="background-color: #c3c3c3">
                                <th ">Producto</th>
                                <th style="border-left: 1px solid black;">Cantidad</th>
                                <th style="border-left: 1px solid black;">Precio</th>
                            </tr>
                        
                    `
    let contentTable = ` `

    let total=0;
    for (let i=0; i < products.length; i++) {
        let pvp;
        
        if (products[i].ofertas != null) {
            pvp = Math.round((products[i].pvp - (products[i].pvp * products[i].ofertas.descuento) / 100.00)*100)/100;
        } else {
            pvp = products[i].pvp;
        } 
        total = total  + (pvp*req.articulos[i].cantidad);
        contentTable = contentTable + `<tr><td style="padding-left: 15px; "> ${products[i].codigoArticulo} ${products[i].modelo} ${products[i].marca}</td>
                                        <td style="padding-left: 15px;text-align: center;border-left: 1px solid black;">${req.articulos[i].cantidad}</td> <td style="padding-left: 15px; text-align: center; border-left: 1px solid black;">${pvp}</td></tr>` 
    }
    let finishContent = content + contentTable + ` </table></div><div><p><span style="padding-left: 25px; padding-right: 60px; font-weight: bold">TOTAL:</span><span style="margin-left: 570px; font-weight: bold;">${total}</span></p></div>`
    return finishContent;
}

module.exports = routesInvoices;