import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';

import { AuthServiceService} from '../../../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';





@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePassForm;
  notPassword: boolean;
  strengthPassword: boolean;
  incorrectMessage: string;
  incorrectMessageConf: String;
  notConfPassword: boolean;
  errorSamePassword: boolean;
  changePassFailedMessage: String;
  changePasswordFailed: boolean;


  obligatoryFieldPassword: {};
  failedPasswordStyle: {};
  passwordStyle: {};
  obligatoryFieldsconfNewPassword: {};
  notSamePassword: {};
  changePassFailedMessageStyle: {};

  expresionRegFuerte = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  expresionRegMedia = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

  constructor(private formBuilder: FormBuilder, private authService: AuthServiceService, private router: Router, private activeRoute: ActivatedRoute, private toastr: ToastrService) {
    this.changePassForm = this.formBuilder.group({
      newPassword: '',
      confNewPassword: ''
    });

   }

  ngOnInit() {
    this.changePassForm.patchValue({newPassword:"123456qwedf"});
    this.changePassForm.patchValue({confNewPassword:"123456qwedf"});
  }

  onSubmit(changePassData) {
    let error = false;
    let newPass = changePassData.newPassword;
    let confNewPassword = changePassData.confNewPassword;
    let idUser = this.activeRoute.snapshot.params.idUSer;

    if (newPass == null || newPass == "") {
      error = true;
      this.notPassword = true;
      this.obligatoryFieldPassword = {
        "border-color" : "red"
      }
      this.failedPasswordStyle = {
        "color" : "red"
      }
      this.toastr.error(this.incorrectMessage, "", {
        timeOut: 4000
      });
    } else {
      this.notPassword = false;
      this.obligatoryFieldPassword = {
        "border-color": "rgb(204,204,204)"
      }
    }

    if (confNewPassword == null ||  confNewPassword == "" ) {
      error = true;
      this.notConfPassword = true;
      this.incorrectMessage = "Campo obligatorio";
      this.obligatoryFieldsconfNewPassword = {
        "border-color" : "red"
      }

      this.toastr.error(this.incorrectMessage, "", {
        timeOut: 4000
      });

      this.notSamePassword = {
        "color": "red"
      };
    } else {
      this.notConfPassword = false;
      this.obligatoryFieldsconfNewPassword = {
        "border-color": "rgb(204,204,204)"
      };
    }

    if (confNewPassword !=  newPass) {
      error = true;
      this.incorrectMessage = "Las contraseñas no coinciden";
    }

    if (!error && !this.errorSamePassword) {
      let password = {
        username: idUser,
        password: newPass
      };
      let changePassword = this;
      this.authService.updatePassword2(password).subscribe(function(response){
        if (response.body.code == 200) {
          changePassword.router.navigate(["/login"]);
        } else {
          changePassword.changePasswordFailed = true;
          changePassword.changePassFailedMessage = response.body.message;
          changePassword.changePassFailedMessageStyle = {
            "color": "red"
          }
        }
      });

    } else{
      this.toastr.error(this.incorrectMessage, "", {
        timeOut: 4000
      });
    }
  }

  strengthPasswordCheck() {
    let newPassword = this.changePassForm.getRawValue().newPassword;
    if (newPassword != undefined && newPassword != "") {
      this.strengthPassword = true;
      this.notPassword = false;
      this.obligatoryFieldPassword = {
        "border-color": "rgb(204,204,204)"
      };

      if (this.expresionRegFuerte.test(newPassword)) {
        this.passwordStyle = {
          "margin": "0.25em",
          "margin-bottom":"1em",
          "width": "15em",
          "height": "0.5em",
          "background-color": "green"
        };
      } else if (this.expresionRegMedia.test(newPassword)) {
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
      this.notPassword = true;
      this.obligatoryFieldPassword = {
        "border-color" : "red"
      }
      this.failedPasswordStyle = {
        "color" : "red"
      }
      this.toastr.error("Campo obligatorio", "", {
        timeOut: 4000
      });
    };
  };

  confirmationPasswordCheck() {
    let password = this.changePassForm.getRawValue().newPassword;
    let confirPassword = this.changePassForm.getRawValue().confNewPassword;

    if (confirPassword != undefined) {
      this.notConfPassword = false;
      this.obligatoryFieldsconfNewPassword = {
        "border-color": "rgb(204,204,204)"
      };
    };
    if (password == confirPassword) {
      this.notConfPassword = false;
      this.errorSamePassword = false;
    } else {
      /*this.notConfPassword = true;
      this.errorSamePassword = true;
      this.incorrectMessageConf = "Las contraseñas no coinciden";*/
      this.notSamePassword = {
        "color": "red"
      };

      this.toastr.error("Las contraseñas no coinciden", "", {
        timeOut: 4000
      });
    };
  };
}
