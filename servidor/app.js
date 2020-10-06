// Dependencias
var express = require('express');

var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose'); // Utilizamos la librería de mongoose
var passport = require('passport');


var app = express();

module.exports = app;

app.set('server_hostname', process.env.HOSTNAME || "localhost");



var urlInit = path.join(__dirname, '../cliente/');
var urlImagesProducts = path.join(__dirname, '../images/products/');
var urlImagesBrands = path.join(__dirname, '../images/brands/');
var urlImagesPayments = path.join(__dirname, '../images/payments/');
var urlImagesCategories = path.join(__dirname, '../images/categories/');
var urlPdfs = path.join(__dirname, '../pdfs');

var properties = require('./utils/propertiesHelper.js');
// Middleware
//para servir datos estaticos
app.use(properties.get('nevado.server.base.context') +'/static',express.static(urlInit));
app.use(properties.get('nevado.server.base.context') + '/static/products', express.static(urlImagesProducts));
app.use(properties.get('nevado.server.base.context') + '/static/brands', express.static(urlImagesBrands));
app.use(properties.get('nevado.server.base.context') + '/static/payments', express.static(urlImagesPayments)); 
app.use(properties.get('nevado.server.base.context') + '/static/categories', express.static(urlImagesCategories)); 
app.use(properties.get('nevado.server.base.context') + '/static/pdfs', express.static(urlPdfs)); 

//conexión base de datos.
mongoose.Promise = global.Promise;
mongoose.connect(properties.get('nevado.server.database'), { useNewUrlParser: true, useCreateIndex: true},function(error) {  //useCreateIndex para definir indices como unicos en mongoose
	if(error) {
		console.log('Error en la conexión con mongodb. Pulse Ctrl + c  para terminar la ejecución del programa');
		throw error;
		process.exit(1);
	} else {
		console.log('Conectado a MongoDB. Pulse Ctrl + c para terminar la ejecución del programa');
	}
});


app.use(session({
	secret: 'proyecto sandra 2019',
	resave: true , //por cada llamada que se hace al servidor se guarda en la base de datos
	saveUninitialized: true ,//Guarda el objeto vacío.
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		autoReconnect: true
	}),
	cookie:{
		expires :new Date(Date.now() + 3600000),
		maxAge :3600000,
	}
}));

app.use(bodyParser.urlencoded({ extended: true })); //transforma las urls a json
app.use(bodyParser.json());


app.use(passport.initialize()); //inicializa passport
app.use(passport.session()); 

var routes = require('./routes/apiRest.js');
var routesAdmin = require('./routes/apiRestAdmin.js');
var routesUser = require('./routes/apiRestUser.js');
var routesFront = require('./routes/front/apiRestFront.js');
var routesOrders = require('./routes/apiRestOrders.js');





app.get(['/status'],function(req, res, next) {
	console.log("Estoy vivo");
	res.status(200).send('OK');
});

app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context'), routesAdmin);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.auth.context'), routes);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.user.context'), routesUser);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.front.context'), routesFront);
app.use(properties.get('nevado.server.base.context') + properties.get('nevado.server.orders.context'), routesOrders);

console.log('Admin context: ' + properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context'));
console.log('Auth context: ' + properties.get('nevado.server.base.context') + properties.get('nevado.server.auth.context'));
console.log('User context: ' + properties.get('nevado.server.base.context') + properties.get('nevado.server.user.context'));
console.log('Front context: ' + properties.get('nevado.server.base.context') + properties.get('nevado.server.front.context'));
console.log('Orders context: ' + properties.get('nevado.server.base.context') + properties.get('nevado.server.orders.context'));


//se muestra el index siempre que se acceda a /
app.get(['/','/login'],function(req, res, next) {
	console.log("funcion que muestra index");
	res.sendFile(urlInit + '/src/index.html');
});

// //manejo de paginas que no encuentro
app.use(function(req, res, next) {
	console.log("funcion que maneja paginas que no encuentro");
	if(req.path == '/registerInfo'){ //---------------modificarlo--------------------
		res.redirect('/');
	}else{
		res.redirect('/');
		// res.sendFile(urlInit + '/src/index.html');
	}
	
});

//manejor de errores de server
app.use(function(err, req, res, next) {
	console.log("funcion que maneja errores");
  console.error(err.stack);
  res.status(500).send('Lo sentimos, algo esta roto en el servidor');
});

