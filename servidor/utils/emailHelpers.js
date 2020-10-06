var nodemailer = require("nodemailer");
var properties = require('../utils/propertiesHelper.js');

var emailHelper = {};


emailHelper.sendMsg = async function (user,message, reason){

	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	let testAccount = await nodemailer.createTestAccount();
  
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		service:'Gmail',
		secure:false,
		tls: {
			rejectUnauthorized: false
		},
	  	auth: {
			user: 'nevado.proyecto.19@gmail.com', 
			pass: 's070718a2' 
	  	}
	});


	// let transporter = nodemailer.createTransport({
	// 	service: 'Gmail',
	// 	auth: {
	// 		type: 'OAuth2',
	// 		user: 'nevado.proyecto.19@gmail.com',
	// 		clientId: '423156716801-d18ssqa3mq0408pvqno80jeg79lst7g2.apps.googleusercontent.com',
	// 		clientSecret: '9cWSHMkrXp9hStOV-bEvLoMQ',
			
	// 		refreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
	// 		accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x',
	// 		expires: 1484314697598
	// 	}
	// });


  //npm install googleapis@39 --save
	// send mail with defined transport object
	let info = await transporter.sendMail({
	  from: 'nevado.proyecto.19@gmail.com', // sender address
	  to: user, // list of receivers
	  subject: reason, // Subject line
	  text: "Hello world?", // plain text body
	  html: message // html body
	}).catch(function (err){
		console.log(err);
	});
  }

  module.exports = emailHelper;
  
