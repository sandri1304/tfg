import { Component, OnInit, Output , EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router,ActivatedRoute} from "@angular/router";
import { ToastrService } from 'ngx-toastr';




import { AuthServiceService} from '../../../services/auth-service.service';
import { UserServiceService} from '../../../services/user-service.service';


import { Users } from '../../../dataModels/users';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm;
  msg: string;
  notEmail: boolean;
  incorrectMessage: string;
  incorrectUser: string;
  notValidUser: boolean = false;
  failedEmailStyle: {};
  obligatoryFieldsEmail: {};
  obligatoryFieldsPwd: {};
  failedUserStyle: {};
  user: Users;

  registerForm;
  messageEmail: string;
  notPassword: boolean;
  notConfPassword: boolean;
  confirMessagepassword: string;
  notTermsUse: boolean;
  userRegister: boolean;
  userRegisterMessage: String;
  
  obligatoryEmail: {};
  obligatoryPassword: {};
  passwordStyle: {};
  obligatoryConfPassword: {};
  notSamePassword: {};
  obligatoryTermsUse: {};
  messageTermsUse: {};
  notPasswordStyle: {};
  userRegisterStyle: {};

  

  @Output() nameUser = new EventEmitter<string>();
  @Output() url = new EventEmitter<String>();



  notValidEmail: boolean;
  notValidPassword: boolean;
  urlRedirect: string;

  expresionEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  expresionRegFuerte = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  expresionRegMedia = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

  constructor(private formBuilder: FormBuilder,
              private authService: AuthServiceService,
              private router: Router,
              private userService: UserServiceService,
              private activeRoute: ActivatedRoute, 
              private toastr: ToastrService) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });

    this.registerForm = this.formBuilder.group({
      email: '',
      password: '',
      confirmationPassword: '',
      termsUse: true,
      publicity: false
    });
   }

  ngOnInit() {

    this.loginForm.patchValue({email:"nevado.proyecto.19@gmail.com"});
    this.loginForm.patchValue({password:"neva.19"});

    // let emailinit = (new Date()).getTime() + "@gmail.com";
    // this.registerForm.patchValue({email:emailinit});
    // this.registerForm.patchValue({password:"12345"});
    // this.registerForm.patchValue({confirmationPassword: "12345"});
    // this.registerForm.patchValue({termsUse: true});

    if (this.activeRoute.snapshot.queryParams.url != null && this.activeRoute.snapshot.queryParams.url != "") {
      this.urlRedirect = this.activeRoute.snapshot.queryParams.url;
    }


    

    //this.router.navigate([this.activeRoute.snapshot.queryParams.url]);
    //this.userService.setPath(this.activeRoute._routerState.snapshot.url);
  }

  onSubmit(loginData) {
    let email = this.loginForm.getRawValue().email;
    let password = this.loginForm.getRawValue().password;
    let error = false;

    if((email == undefined || email =="")){
      this.obligatoryFieldsEmail = {
        "border-color": "red"
      };
      this.toastr.error("El email es un campo obligatorio", "", {
        timeOut: 4000
      });

      error = true;
    }else{
      this.notValidEmail = false;
      this.obligatoryFieldsEmail = {
        "border-color": "rgb(204,204,204)"
      };
    }

    if((password == undefined || password =="")){
      this.obligatoryFieldsPwd = {
        "border-color": "red"
      };
      this.toastr.error("El email es un campo obligatorio", "", {
        timeOut: 4000
      });
      error=true;
    }else{
      this.notValidPassword = false;
      this.obligatoryFieldsPwd = {
        "border-color": "rgb(204,204,204)"
      };
    }

    if (!error) {
      this.user = {
        username: email,
        password: password
      };

      var me = this;
      this.authService.getLogin(this.user).subscribe(function(response) {
        if(response.body.code == 200) {
          let name = response.body.userName.substr(0, response.body.userName.indexOf("@"));
          me.userService.setUser({
            logged: true,
            userName:name,
            id: response.body.id,
            profile: (response.body.urlRedirect.indexOf("admin") != -1) ? "admin" : "client"
          });

          me.nameUser.emit(name);
          me.url.emit("/user/" + response.body.id);
          if (me.urlRedirect  != null  && me.urlRedirect != "") {
            me.router.navigate([me.urlRedirect]);
          } else {
            me.router.navigate([response.body.urlRedirect]);
          };

        };
        if (response.body.code == 211) {
          me.incorrectUser = response.body.message;
          me.toastr.error( me.incorrectUser, "", {
            timeOut: 4000
          });
        };
      });
    };
  };

  emailCheck() {
    let email = this.loginForm.getRawValue().email;
    if (email != undefined && email != "") {
      this.notEmail = false;
    };
    if (this.expresionEmail.test(email)) {
      this.notEmail = false;
    } else {
      this.toastr.error("Formato de email incorrecto", "", {
        timeOut: 4000
      });
      this.obligatoryFieldsEmail = {
        "border-color": "red"
      };
    };
  };

  emailCheckRegister() {
    let email = this.registerForm.getRawValue().email;
    if(email != undefined && email != "") {
      this.notEmail = false;
      this.obligatoryEmail = {
        "border-color": "rgb(204,204,204)"
      };
    };
    if (this.expresionEmail.test(email)) {
      this.notEmail = false;
    } else {
      this.notEmail = true;
      this.toastr.error("Formato de email incorrecto", "", {
        timeOut: 4000
      });
      this.obligatoryEmail = {
        "border-color": "red"
      };
    };
  }

  strengthPasswordCheck() {
    let password = this.registerForm.getRawValue().password;
    if (password != undefined && password != "") {
      this.notPassword = false;
      this.obligatoryPassword = {
        "border-color": "rgb(204,204,204)"
      };

      if (this.expresionRegFuerte.test(password)) {
        this.passwordStyle = {
          "margin": "0.25em",
					"margin-bottom":"1em",
	        "width": "15em",
	        "height": "0.5em",
	        "background-color": "green"
        };
      } else if (this.expresionRegMedia.test(password)) {
        this.passwordStyle = {
          "margin": "0.5em",
					"margin-bottom": "1em",
	        "width": "15em",
	        "height": "0.5em",
	        "background-color": "orange"
        };
      } else {
        this.passwordStyle = {
          "margin": "0.25em",
					"margin-bottom": "1em",
	        "width": "15em",
	        "height": "0.5em",
	        "background-color": "red"
        };
      };
    } else {
      this.passwordStyle = {
        "margin": "0.25em",
        "margin-bottom":"1em",
        "width": "15em",
        "height": "0.5em",
        "background-color": "white"
      };
    };
  }

  confirmationPasswordCheck() {
    let password = this.registerForm.getRawValue().password;
    let confirPassword = this.registerForm.getRawValue().confirmationPassword;

    if (confirPassword != undefined) {
      this.notConfPassword = false;
      this.obligatoryConfPassword = {
        "border-color": "rgb(204,204,204)"
      };
    };
    if (password == confirPassword) {
      this.notConfPassword = false;
    } else {
      this.notConfPassword = true;
      this.toastr.error("Las contraseñas no coinciden", "", {
        timeOut: 4000
      });
      this.obligatoryConfPassword = {
        "border-color": "red"
      };
    };
  };

  onSubmitRegister(registerData) {
    let error = false;
    let email = registerData.email;
    let password = registerData.password;
    let confPassword = registerData.confirmationPassword;
    let termsUse = registerData.termsUse;
    let publicity = registerData.publicity;

    if (email == undefined || email == "") {
      this.notEmail = true;
      this.obligatoryEmail = {
        "border-color" : "red"
      };
      this.toastr.error("El email es un campo obligatorio", "", {
        timeOut: 4000
      });
      error = true;
    } else {
      this.notEmail = false;
      this.obligatoryEmail = {
        "border-color": "rgb(204,204,204)"
      }
    }

    if (password == undefined || password == "") {
      this.notPassword = true;
      this.obligatoryPassword = {
				"border-color":"red"
      };
      this.toastr.error("La contraseña es un campo obligatorio", "", {
        timeOut: 4000
      });
      error = true;
    } else {
      this.notPassword = false;
      this.obligatoryPassword = {
				"border-color": "rgb(204,204,204)"
			};
    }

    if (confPassword == undefined || confPassword == "") {
			this.notConfPassword = true;
			this.confirMessagepassword ="Campo obligatorio";
			this.obligatoryConfPassword = {
				"border-color":"red"
      };
      this.toastr.error("Debe rellenar el campo confirme su contraseña para poder registrarse", "", {
        timeOut: 4000
      });
			error = true;
		} else {
			this.notConfPassword = false;
			this.obligatoryConfPassword = {
				"border-color": "rgb(204,204,204)"
      };
    };
    
    if (confPassword != password) {
      error = true; 
      this.toastr.error("Las contraseñas no coinciden", "", {
        timeOut: 4000
      });
    };

		if (termsUse == false || termsUse == undefined) {
			this.notTermsUse = true;
			this.obligatoryTermsUse = {
				"border-color":"red"
      };
      this.toastr.error("Acepta los términos y condiciones para terminar su registro", "", {
        timeOut: 4000
      });
			error = true;
		} else {
			this.notTermsUse = false;
			this.obligatoryTermsUse = {
				"border-color":"rgb(204,204,204)"
			};
    }

    if (!error) {
      this.user = {
        publicity: publicity,
        username: email,
        password: password
      };
      let register = this;
      this.authService.getRegister(this.user).subscribe(function(response){
        if (response.body.code == 200) {
          register.router.navigate(["/registerInfo"]);
        } else {
          register.userRegister = true;
          register.toastr.error(response.body.message, "", {
            timeOut: 4000
          });
        }
      });
    }
  }

};
