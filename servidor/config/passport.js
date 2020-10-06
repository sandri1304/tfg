var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var usuarios = require('../modelos/usuarios.js');
var properties = require('../utils/propertiesHelper.js');

passport.serializeUser((usuario, done) => { //seriealizamos un usuario.
    done(null, usuario._id);
});

passport.deserializeUser((id, done) => { //metodo que se invoca cuando llega un id en una cookie para saber a que usuario corresponde.
    usuarios.findById(id, (err, usuario) =>{
        done(err, usuario);
    })
});

passport.use(new localStrategy(
  //  {usernameField: 'correo',
   // passwordField: 'contrasenia'},
    (email, password, done) => {
        usuarios.findOne({'correo': email}, (err, user) => {
            if(!user) {
                return done(null, false, {message: "El correo no está registrado"});
            } else {
                user.comparePassword(password, (err, isEquals) => {
                    if (isEquals) {
                        return done(null, user);
                    } else {
                        return done(err, false, {message: "La contraseña es incorrecta"});
                    }
                });
            }
        })
    }
));

responseFunction = (error, code, message) => {
    let response = {
        error: error,
        code : code, 
        message: message
    }

    return response;
};

exports.isAuthenticated = (req, res, next) => {
    if(!req.user){
        res.send(responseFunction(true, 401, "sin autorizacion"));
        return;
    }
    let uri = req.baseUrl;
    if(req.isAuthenticated() && uri.startsWith(properties.get('nevado.server.base.context') + properties.get('nevado.server.admin.context')) && req.user.rol == "admin"){
        return next();
    }else if(req.isAuthenticated() && uri.startsWith(properties.get('nevado.server.base.context') + properties.get('nevado.server.user.context')) && req.user.rol == "cliente"){
        return next();
    }else if(req.isAuthenticated() && uri.startsWith(properties.get('nevado.server.base.context') + properties.get('nevado.server.front.context')) && req.user.rol == "cliente"){
        return next();
    }else if(req.isAuthenticated() && uri.startsWith(properties.get('nevado.server.base.context') + properties.get('nevado.server.orders.context')) && req.user.rol == "cliente"){
        return next();
    }else if (req.path == "/logout") {
        return next();
    } else{
        res.send('cambiar por 401 unauthorized');
    }   
};