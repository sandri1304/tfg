import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FrontServiceService } from '../../../services/front/front-service.service';


@Component({
  selector: 'app-review-component',
  templateUrl: './review-component.component.html',
  styleUrls: ['./review-component.component.css']
})
export class ReviewComponentComponent implements OnInit {

  imagen: string | ArrayBuffer = null;

  commentary = new FormGroup({
    titleReview: new FormControl(''),
    review: new FormControl(''),
    recomendation: new FormControl(''),
    alias: new FormControl(''),
    emailAlias: new FormControl(''),
    currentRate:new FormControl('')
  });

  rateQuality:number;
  currentRate:number;
  error:boolean;
  screen300:boolean;
  screen400:boolean;

  expresionEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ReviewComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private toastr: ToastrService,
    private frontSrv: FrontServiceService) { }

  ngOnInit() {
    this.imagen =  this.data.imagen;
    this.screen300 = document.body.offsetWidth <= 414;
    this.screen400 = document.body.offsetWidth <= 1024;
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  addReview()  {
    if (isNaN(this.currentRate)) {
      this.toastr.error("La calificación general es obligatoria", "", {
        timeOut: 2000
      });
    }

    if (this.commentary.value.titleReview == ""){
      this.toastr.error("El título de la reseña es obligatorio", "", {
        timeOut: 2000
      });
    }

    if (this.commentary.value.review == ""){
      this.toastr.error("No se puede publicar una reseña con el campo reseña  vacío", "", {
        timeOut: 2000
      });
    }

    if (this.commentary.value.alias == ""){
      this.toastr.error("El alías es  obligatorio", "", {
        timeOut: 2000
      });
    }

    if (this.commentary.value.emailAlias == ""){
      this.toastr.error("El email es  obligatorio", "", {
        timeOut: 2000
      });
    }

    if (!this.expresionEmail.test(this.commentary.value.emailAlias)) {
      this.toastr.error("El email no  tiene un formato correcto", "", {
        timeOut: 2000
      });
    }

    //let formData  = new FormData();
    let review = {
      'calificacionGeneral': this.currentRate,
      'titulo': this.commentary.value.titleReview,
      'comentario': this.commentary.value.review,
      'recomendacion': this.commentary.value.recomendation,
      'calidadPrecio':  isNaN(this.rateQuality)? 0 :  this.rateQuality,
      'alias': this.commentary.value.alias,
      'email': this.commentary.value.emailAlias,
    }

    let me = this;
    let idProduct = this.data._id;
    this.frontSrv.addReview(review, idProduct).subscribe(response => {
      if (response.body.code == 200) {
        me.toastr.success("Su reseña ha sido publicada", "", {
          timeOut: 2000
        });
        me.closeDialog("");
      } else {
        me.toastr.error(response.body.message, "", {
          timeOut: 2000
        });
      };
    });
  }

}
