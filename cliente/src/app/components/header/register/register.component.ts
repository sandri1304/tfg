import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from "@angular/router";

import { AuthServiceService} from '../../../services/auth-service.service';

import { Users } from '../../../dataModels/users';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm;
  expresionEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  expresionRegFuerte = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  expresionRegMedia = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

  notEmail: boolean;
  messageEmail: string;
  notPassword: boolean;
  notConfPassword: boolean;
  confirMessagepassword: string;
  notTermsUse: boolean;
  userRegister: boolean;
  userRegisterMessage: String;
  user: Users;
  messageGeneral: string;

  obligatoryEmail: {};
  failedEmailStyle: {};
  obligatoryPassword: {};
  passwordStyle: {};
  obligatoryConfPassword: {};
  notSamePassword: {};
  obligatoryTermsUse: {};
  messageTermsUse: {};
  notPasswordStyle: {};
  userRegisterStyle: {};

  constructor(private formBuilder: FormBuilder, 
              private authService: AuthServiceService, 
              private router: Router,
              private toastr: ToastrService) {
    this.registerForm = this.formBuilder.group({
      email: '',
      password: '',
      confirmationPassword: '',
      termsUse: true,
      publicity: false
    });
  }

  ngOnInit() {
    let emailinit = (new Date()).getTime() + "@gmail.com";
    this.registerForm.patchValue({email:emailinit});
    this.registerForm.patchValue({password:"12345"});
    this.registerForm.patchValue({confirmationPassword: "12345"});
    this.registerForm.patchValue({termsUse: true});
  }

  onSubmit(registerData) {
    let error = false;
    let email = registerData.email;
    let password = registerData.password;
    let confPassword = registerData.confirmationPassword;
    let termsUse = registerData.termsUse;
    let publicity = registerData.publicity;

    if (email == undefined || email == "") {
      this.notEmail = true;
      this.messageEmail = "Campo obligatorio";
      this.messageGeneral =  "Campo obligatorio";
      this.obligatoryEmail = {
        "border-color" : "red"
      };
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
      this.notPasswordStyle = {
        "color": "red"
      };
      this.messageGeneral =  "Campo obligatorio";
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
      this.messageGeneral =  "Campo obligatorio";
			this.obligatoryConfPassword = {
				"border-color":"red"
      };
      this.notSamePassword = {
        "color": "red"
      }
			error = true;
		} else {
			this.notConfPassword = false;
			this.obligatoryConfPassword = {
				"border-color": "rgb(204,204,204)"
      };
		};

    if (confPassword != password) {
      error = true; 
      this.messageGeneral = "Las contraseñas no coinciden";
    };

		if (termsUse == false || termsUse == undefined) {
      this.notTermsUse = true;
      this.messageGeneral =  "Campo obligatorio";
			this.obligatoryTermsUse = {
				"border-color":"red"
      };
      this.messageTermsUse = {
				"color":"red"
			};
			error = true;
		} else {
			this.notTermsUse = false;
			this.obligatoryTermsUse = {
				"border-color":"rgb(204,204,204)"
			};
    }

    debugger;
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
          register.userRegisterMessage = response.body.message;
          register.userRegisterStyle = {
            "color": "red"
          }
        }
      });
    } else {
      this.toastr.error(this.messageGeneral, "", {
        timeOut: 4000
      });
      return;
    };
  }

  emailCheck() {
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
      this.messageEmail = "Formato de email incorrecto";
      this.failedEmailStyle = {
        "color": "red"
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
      this.confirMessagepassword = "Las contraseñas no coinciden";
      this.notSamePassword = {
        "color": "red"
      };
    };
  };


}
