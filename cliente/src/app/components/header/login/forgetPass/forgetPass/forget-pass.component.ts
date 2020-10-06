import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router,ActivatedRoute} from "@angular/router";
import { AuthServiceService } from '../../../../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.css']
})
export class ForgetPassComponent implements OnInit {

  forgetForm;
  incorrectMessage: string;
  obligatoryFieldsEmail: {};
  failedEmailStyle: {};
  notEmail: boolean;
  notValidEmail: boolean;
  email: string;
  idUser: string;
  message: string;

  expresionEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private formBuilder: FormBuilder, private authService: AuthServiceService, private router: Router, private toastr: ToastrService) {
    this.forgetForm = this.formBuilder.group({
      email: '',
    });
  }

  ngOnInit() {

  };

  onSubmit(forgetData) {

    let error = false;
    let emailData = this.forgetForm.getRawValue().email;

    if (emailData == undefined || emailData == "") {
      this.notValidEmail = true;
      this.incorrectMessage = "Campo obligatorio";
      this.obligatoryFieldsEmail = {
        "border-color": "red"
      };
      this.toastr.error("El email es un campo obligatorio", "", {
        timeOut: 4000
      });
      error = true;
    } else {
      this.notValidEmail = false;
      this.obligatoryFieldsEmail = {
        "border-color": "rgb(204,204,204)"
      };
    };

    if (!error) {
      this.email = emailData;
      var me = this;
      this.authService.updatePassword(this.email).subscribe(function(response) {
        if (response.body.code == 200) {
          me.router.navigate(['/login']);
        } else {
          me.message ="Email incorrecto.";

          me.toastr.error("Email incorrecto.", "", {
            timeOut: 4000
          });
        }
      });


    }
  };

  emailCheck() {
    let email = this.forgetForm.getRawValue().email;
    if (email != undefined && email != "") {
      this.notEmail = false;
    };
    if (this.expresionEmail.test(email)) {
      this.notEmail = false;
    } else {
      this.notEmail = true;
      this.toastr.error("Formato de email incorrectoo", "", {
        timeOut: 4000
      });
      this.obligatoryFieldsEmail = {
        "border-color": "red"
      };
    };
  };

}
