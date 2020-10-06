import { OnInit, ViewChild  } from '@angular/core';
import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Offers } from 'src/app/dataModels/interfacesOffers';
import { OffersServiceService } from 'src/app/services/admin/offers/offers-service.service';


@Component({
  selector: 'app-offers-info',
  templateUrl: './offers-info.component.html',
  styleUrls: ['./offers-info.component.css']
})
export class OffersInfoComponent implements OnInit {


  messageError: string;
  errorLoadingData: boolean;
  errorSaveOffer: boolean;
  errorFormat: {};


  offer = new FormGroup({
    idOferta: new FormControl(''),
    descuento: new FormControl(''),
    fechaInicio: new FormControl(''),
    fechaFin: new FormControl(''),
    descripcion: new FormControl('')
  });


  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OffersInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dOffersSrv: OffersServiceService,
    private OfferFormBuilder: FormBuilder,
    private toastr: ToastrService  ) {
  }

  ngOnInit() {
    if (this.data._id != null) {
      let offers = this.data;
      let fechaInit = new Date(this.data.fechaInicio);
      let dateInit = (fechaInit.getDate().toString().length == 1) ? "0" + fechaInit.getDate() : fechaInit.getDate();
      let monthInit = ((fechaInit.getMonth() + 1).toString().length == 1) ? "0" + (fechaInit.getMonth() + 1) :  fechaInit.getMonth() + 1;
      let InitDateP = fechaInit.getFullYear() + "-" + monthInit + "-" + dateInit;
      let fechaEnd  = new Date(this.data.fechaFin);
      let dateEnd = (fechaEnd.getDate().toString().length == 1) ? "0" + fechaEnd.getDate() : fechaEnd.getDate();
      let monthEnd = ((fechaEnd.getMonth() + 1).toString().length == 1) ? "0" + (fechaEnd.getMonth() + 1) :  fechaEnd.getMonth() + 1;
      let EndDateP = fechaEnd.getFullYear() + "-" + monthEnd + "-" + dateEnd;
      offers.fechaInicio = InitDateP;
      offers.fechaFin = EndDateP;
      this.offer = this.OfferFormBuilder.group(offers);
    }
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  closeError() {
    this.errorLoadingData = false;
  }

  saveOffer() {

    let updateOffer = {
      idOferta: this.offer.value.idOferta,
      descuento: this.offer.value.descuento,
      fechaInicio: this.offer.value.fechaInicio,
      fechaFin: this.offer.value.fechaFin,
      descripcion: this.offer.value.descripcion
    };



    let offers = this;
    if (this.data._id != null) {
      this.dOffersSrv.updateOffer(this.data._id, updateOffer).subscribe(function(response){
        if (response.body.code == 200) {
          offers.closeDialog("okUO");
        } else {
          offers.toastr.error(response.body.message, "", { timeOut: 2000 });
          return;
        }
      });
    } else {
      this.dOffersSrv.saveOffer(updateOffer).subscribe(function(response) {
        if (response.body.code == 200) {
          offers.closeDialog("okNO");
        } else {
          offers.toastr.error(response.body.message, "", { timeOut: 2000 });
          return;
        }
      });
    }

  }

}
