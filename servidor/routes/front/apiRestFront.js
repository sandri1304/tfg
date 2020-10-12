var express = require('express');
var frontSrv = require('../../services/front/front_service');
var reviews = require('../../modelos/comentarios');
var products = require('../../modelos/articulos');
var orders =  require ('../../modelos/pedidos');
var bills = require('../../modelos/facturas');
var messages = require('../../modelos/mensajes');
var clients  = require('../../modelos/clientes');
var utils = require('../../utils/utils');
const { getBills } = require('../../services/front/front_service');
var passport = require('passport');
var passportConfig = require('../../config/passport.js');



var routes = express.Router();

//http://localhost:8080/nevado/front/test
routes.get('/test', function (req, res, next) {
    res.send("OK");
});

routes.get('/topVentas', async function (req, res, next) {
    let data = await frontSrv.getTopVentas();
    res.send(data);
});

routes.get('/ofertas', async function (req, res, next) {
    let ofertas = await frontSrv.getOfertas();
    let ids = ofertas.map(o => o._id);
    console.log(ids);
    let data = await frontSrv.getArticulosConOfertas(ids);
    res.send(data);
});

routes.get('/largeAppliances', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/smallKitchenAppliances', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/image', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/sound', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/telephony', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/personalCare', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/cleaning', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/airConditioning', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/computing', async function (req, res, next) {
    let data = await frontSrv.getCategories(req.query);
    res.send(data);
});

routes.get('/product/:idProduct', async function(req, res, next){
    let data  = await frontSrv.getProductById(req);
    res.send(data);
});

routes.get('/brand', async function(req, res, next){
    let data = await frontSrv.getBrand(req.query);
    res.send(data);
});

routes.get('/similarProducts', async function(req, res, next){
    console.log(req.query);
    let data = await frontSrv.getProductsByCategory(req.query);
    res.send(data);
});

routes.get('/category/:nameCategory', async function(req, res, next){
    let data = await frontSrv.getProductsCategory(req, false);
    let count = await frontSrv.getProductsCategory(req, true);  
    let c;
    if(count.length == 0){
        c= 0;
    }else{
        c = count[0].count;
    }
    res.send({data:data, count:c});
});

routes.get('/brands', async function(req, res, next){
    let  data  = await frontSrv.getBrands(req);
    res.send(data)
});

routes.get('/paymentMethods', passportConfig.isAuthenticated, async function(req, res, next){
    let data = await frontSrv.getPayments();
    res.send(data);
});

routes.post('/review', passportConfig.isAuthenticated, async function(req, res, next){
    let review = createObjReview(req);
    console.log(req);
    let reviewAdd;

    reviews.create(review, async function(err, reviewSave){
		if (err) {
			this.error = true;
		} else {
            let product = await products.findOne({'_id': req.query.idProduct});
            product.estrellas = product.estrellas + review.calificacionGeneral;
            product.usuarios = product.usuarios + 1;
            product.comentarios.push(reviewSave._id);
            products.updateOne({'_id': req.query.idProduct}, product, function (err, user) {
                if (err) {
                    response = utils.getResponse(211, "El producto no se ha encontrado en nuestro sistema", true);
                } else {
                    response = utils.getResponse(200, "El producto se ha actualizado correctamente", false);
                }
                res.send(response);
            })
           
        };
	});
    
});

function addProductToOrder(orderArray, product){
    
    orderArray[product.id] = (orderArray[product.id] || 0 ) + 1;
};

routes.post('/saveOrder', passportConfig.isAuthenticated, async function(req,res, next){
    console.log(req.body);

    let client = await frontSrv.getClientById(req.body.idClient);
    //let user = await frontSrv.getUserEmail(req.body.idUser);
    let confirmation = await frontSrv.getUserconfirmation(req.body.idUser);

    if (confirmation.confirmacion == false) {
        var messageconfir = utils.getResponse(211, "El usuario debe confirmar su cuenta", true);
        res.send(messageconfir);
        return;
    }

    let numOrdersClient = await frontSrv.getNumOrderClient(client);
 
    let current; 

    let orderShop = [];
    let orderOnline  = [];
    let  productNotSame  = [];
    var errorOnline;
    var errorShop;
    var errorOnlineBill;
    
    for (let i = 0; i<req.body.products.length; i++) {
        if (req.body.products[i].id != current) {
            current =  req.body.products[i].id;
            productNotSame.push(req.body.products[i].id);  
        }
        if (req.body.products[i].envioOnline) {
            addProductToOrder(orderOnline, req.body.products[i] );
        } else {
            addProductToOrder(orderShop, req.body.products[i] );
        }
    }

    var response = [];
    let iteratorOnline = Object.keys(orderOnline);
    var articulosOnline  = [];
    for (let key  of iteratorOnline) {
        let articulo =  {articulo: key, cantidad: orderOnline[key]}
        articulosOnline.push(articulo);
    }

    let iteratorShop = Object.keys(orderShop);
    var articulosShop  = [];
    for (let key  of iteratorShop) {
        let articulo =  {articulo: key, cantidad: orderShop[key]}
        articulosShop.push(articulo);
    }
    
    let date = new Date();
    let dateFinish =  date.setDate(date.getDate() + 3);

    if (iteratorOnline.length > 0) {
        let productsOnline = await frontSrv.getProducts(iteratorOnline);
        
        
        let totalOrder = 0;
        let pvp;
        for (let i =  0; i < productsOnline.length; i++) {
            let today = new Date();
            if (productsOnline[i].ofertas != null  ) {
                let dateInit = new Date(productsOnline[i].ofertas.fechaInicio);
                let dateFin =  new Date(productsOnline[i].ofertas.fechaFin);
                
                if  (dateInit <= today && dateFin >=  today) {
                    pvp = Math.round((productsOnline[i].pvp - (productsOnline[i].pvp * productsOnline[i].ofertas.descuento) / 100.00)*100)/100;
                } else {
                    pvp = productsOnline[i].pvp;
                }
            } else {
                pvp  = productsOnline[i].pvp;
            }
            
            totalOrder = totalOrder + pvp * orderOnline[productsOnline[i]._id];
            if (productsOnline[i].stock == 0) {
                var messagestock = utils.getResponse(211, "No queda Stock del producto con modelo " +  productsOnline[i].modelo, true);
                res.send(messagestock);
                return;
            }
            let stockCalculado = productsOnline[i].stock - orderOnline[productsOnline[i]._id];
            if (stockCalculado < 0) {
                stockCalculado = 0;
            }
            let ventas = productsOnline[i].ventas + 1;
            let stock = await frontSrv.updateStockProduct(productsOnline[i]._id, stockCalculado, ventas);
        }

        var orderPetOnline = new orders();
        orderPetOnline.usuarios= req.body.idUser;
        orderPetOnline.total= totalOrder; 
    
        orderPetOnline.fechaEntrada= new Date();
        orderPetOnline.fechaEntrega= dateFinish;
        orderPetOnline.formaPago= req.body.payment;
        orderPetOnline.cobrado= (req.body.payment != "Contrareembolso");
        orderPetOnline.estado= "Pendiente envio";
        orderPetOnline.articulos= articulosOnline;

        
        let numPedido = Math.floor((Math.random() * 99999) + 1); 
        orderPetOnline.idPedido = numPedido;
        
        orderPetOnline.save(function(err, order) {
            if (err) {
                this.errorOnline  = true;
            } else {
                pedidos = numOrdersClient.pedidos + 1;
                clients.updateOne({'_id': client}, {pedidos: pedidos}, function (err, user) {
                    if(err) {
                        this.erroOnline = true;
                    }
                });
                this.errorOnline = false;
            };

        });
    }

    if (iteratorShop.length > 0) {
        let productsShop = await frontSrv.getProducts(iteratorShop);
        
        let totalOrder = 0;

        let pvp;
        for (let i =  0; i < productsShop.length; i++) {
            let today = new Date();
            if (productsShop[i].ofertas != null  ) {
                let dateInit = new Date(productsShop[i].ofertas.fechaInicio);
                let dateFin =  new Date(productsShop[i].ofertas.fechaFin);
                
                if  (dateInit <= today && dateFin >=  today) {
                    pvp = Math.round((productsShop[i].pvp - (productsShop[i].pvp * productsShop[i].ofertas.descuento) / 100.00)*100)/100;
                } else {
                    pvp = productsShop[i].pvp;
                }
            }else {
                pvp = productsShop[i].pvp;
            }
            totalOrder = totalOrder + pvp * orderShop[productsShop[i]._id];
            if (productsShop[i].stock == 0) {
                var messagestockshop = utils.getResponse(211, "No queda Stock del producto con modelo " +  productsShop[i].modelo, true);
                res.send(messagestockshop);
                return;
            }
            let stockCalculado = (productsShop[i].stock - orderShop[productsShop[i]._id]);
            if (stockCalculado < 0) {
                stockCalculado = 0;
            }
            let ventasShop = productsShop[i].ventas + 1;
            let stock = await frontSrv.updateStockProduct(productsShop[i]._id, stockCalculado, ventasShop);
        }

        var orderPetShop = new orders();
        orderPetShop.usuarios= req.body.idUser;
        orderPetShop.total= totalOrder; 
    
        orderPetShop.fechaEntrada= new Date();
        orderPetShop.fechaEntrega= dateFinish;
        orderPetShop.formaPago= req.body.payment;
        orderPetShop.cobrado= (req.body.payment != "Contrareembolso");
        orderPetShop.estado= "Pendiente recoger";
        orderPetShop.articulos= articulosShop;

        
        let numPedido = Math.floor((Math.random() * 99999) + 1); 
        orderPetShop.idPedido = numPedido;
        orderPetShop.save(function(err, order) {
            if (err) {
                this.errorShop = true;
            } else {
                pedidos = numOrdersClient.pedidos + 1;
                clients.updateOne({'_id': client}, {pedidos: pedidos}, function (err, user) {
                    if(err) {
                        this.erroOnline = true;
                    }
                });
                this.errorShop  = false;
            };
        });

    }
    let message;
    if (!this.errorOnline && iteratorOnline.length > 0 && !this.errorShop && iteratorShop.length ==  0)  {
        message = utils.getResponse(200, "El pedido se ha procesado correctamente. En breves recibirá sus productos en casa", false);
    } else  if (!this.errorOnline && iteratorOnline.length > 0 && !this.errorShop && iteratorShop.length >  0)  {
        message = utils.getResponse(200, "El pedido se ha procesado correctamente. En breves enviaremos los productos seleccionados para envío a casa y en 24 horas podrá pasarse a recoger los productos seleccionados para recoger en tienda", false);
    } else if (this.errorOnline && iteratorOnline.length > 0 && !this.errorShop && iteratorShop.length ==  0)  {
        message = utils.getResponse(211, "El pedido no se ha podido procesar", false);
    } else if (!this.errorOnline && iteratorOnline.length == 0 && this.errorShop && iteratorShop.length >  0)  {
        message = utils.getResponse(211, "El pedido no se ha podido procesar", false);
    } else  if  (!this.errorOnline && iteratorOnline.length == 0 && !this.errorShop && iteratorShop.length >  0){
        message = utils.getResponse(200, "El pedido se ha procesado correctamente. En 24 horas puede pasar a recoger su pedido", false);
    } else {
        message = utils.getResponse(211, "El pedido no se ha podido procesar", false);
    }

    
    if (message.code == 200 && req.body.payment != "Contrareembolso") {
        let bill = await frontSrv.getBills(); 
        let idBill;
        if (bill == null || bill.length == 0){
            idBill =  1;
        } else {
            idBill = bill[0].nFactura + 1;
        } 

        let facturaOnline;
        if  (orderPetOnline != null) {
            facturaOnline = new bills();
            facturaOnline.nFactura = idBill;
            facturaOnline.fecha  = orderPetOnline.fechaEntrada;
            facturaOnline.cliente = orderPetOnline.usuarios;
            facturaOnline.total = orderPetOnline.total;
            facturaOnline.articulos = orderPetOnline.articulos;
            facturaOnline.idPedido =  orderPetOnline.idPedido;

            facturaOnline.save(function(err, order) {
                if (err) {
                    this.errorOnlineBill = true;
                } else {
                    this.errorOnlineBill  = false;
                };
            })
        }

        if  (orderPetShop != null) {
            let facturaShop = new bills();
            if (!this.errorOnlineBill && facturaOnline !=  undefined){
                idBill = idBill + 1;
            };
            facturaShop.nFactura = idBill;
            facturaShop.fecha  = orderPetShop.fechaEntrada;
            facturaShop.cliente = orderPetShop.usuarios;
            facturaShop.total = orderPetShop.total;
            facturaShop.articulos = orderPetShop.articulos;
            facturaShop.idPedido =  orderPetShop.idPedido;

            facturaShop.save(function(err, order) {
                if (err) {
                    this.errorShop = true;
                } else {
                    this.errorShop  = false;
                };
            })
        }
    }
    res.send(message);
    

})

routes.post('/message', passportConfig.isAuthenticated, async function(req,res, next){
    console.log(req.body)
    let email = await frontSrv.getUserEmail(req.body.idUser);
    let fecha = new Date();

    let messageDB = new messages();
    messageDB.idUsuario  = req.body.idUser;
    messageDB.nombreUsuario =  req.body.name;
    messageDB.mensaje = req.body.message;
    messageDB.leido = (req.body.read == 'true');
    messageDB.correoUsuario = email.correo;
    messageDB.fecha = fecha;
    messageDB.save(function(err, messageSave){
        if (err) {
			response = utils.getResponse(211, "El mensaje no se ha podido crear", true);
		} else {
            response = utils.getResponse(200, "Mensaje guardado", true);
        }
        res.send(response);
    });


    
});

function createObjReview(req) {
    let review = {
        calificacionGeneral: req.body.calificacionGeneral,
        titulo: req.body.titulo,
        comentario: req.body.comentario,
        recomendacion: (req.body.recomendacion != null && req.body.recomendacion != "") ? req.body.recomendacion : false,
        calidadPrecio: req.body.calidadPrecio,
        alias: req.body.alias,
        email: req.body.email,
    }

    return review;
}

module.exports = routes;