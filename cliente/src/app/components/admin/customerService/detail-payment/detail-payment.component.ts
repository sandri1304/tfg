import { Component, OnInit, Inject,ViewChild, ElementRef  } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { PaymentsServiceService } from 'src/app/services/admin/customerService/payments-service.service';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-payment',
  templateUrl: './detail-payment.component.html',
  styleUrls: ['./detail-payment.component.css']
})
export class DetailPaymentComponent implements OnInit {

  messageError: string;
  errorFormat: {};
  errorNewPayment: boolean;

  @ViewChild("imagefile", { static: false }) imagefile: ElementRef;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetailPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dPaymentsSrv: PaymentsServiceService,
    private toastr: ToastrService
  ){}

  payment = new FormGroup({
    nombre: new FormControl(''),
  });

  imagen: string | ArrayBuffer = null;

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  savePayment() {
    /*let newPayment = {
      nombre: this.payment.value.nombre,
      logo: ""
    };*/

    if (this.imagefile.nativeElement.files.length == 0) {
      this.toastr.error("Selecciona un fichero", "", { timeOut: 2000 });
      return;
    }
    if (this.imagefile.nativeElement.files.length > 1) {
      this.toastr.error("Solo se permite un fichero", "", { timeOut: 2000 });
      return;
    }
    if (!this.imagefile.nativeElement.files[0].name.endsWith('.png')
      && !this.imagefile.nativeElement.files[0].name.endsWith('.jpg')
      && !this.imagefile.nativeElement.files[0].name.endsWith('.jpeg')) {
      this.toastr.error("El fichero no tiene el formato esperado", "", { timeOut: 2000 });
      return;
    }

    if(this.payment.value.nombre == null) {
      this.toastr.error("Es necesario una nombre para el método de pago", "", { timeOut: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.imagefile.nativeElement.files[0]);
    formData.append('nombre', this.payment.value.nombre);

    let payments = this;
    this.dPaymentsSrv.savePayment(formData).subscribe(function(response) {
      if (response.body.code == 200) {
        payments.closeDialog("okNPayment");
      } else {
        payments.toastr.error(response.body.message, "", { timeOut: 2000 });
        return;
      }
    });
  }

  onImageChange(file: File){
    if (file ) {
      if(file.type.startsWith("image")){
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = event => {
          this.imagen = reader.result;
        };
      }
    }
  }
}
