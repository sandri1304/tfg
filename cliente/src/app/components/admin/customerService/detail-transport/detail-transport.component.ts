import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { TransportsServiceService } from 'src/app/services/admin/customerService/transports-service.service';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-transport',
  templateUrl: './detail-transport.component.html',
  styleUrls: ['./detail-transport.component.css']
})
export class DetailTransportComponent implements OnInit {

  messageError: string;
  errorFormat: {};
  errorNewTransport: boolean;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetailTransportComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dTransportsSrv: TransportsServiceService,
    private toastr: ToastrService
  ){}

  transport = new FormGroup({
    nombre: new FormControl(''),
  });

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }


  saveTransport() {
    let newTransport = {
      nombre: this.transport.value.nombre,
    };

    let transports = this;
    this.dTransportsSrv.saveTransport(newTransport).subscribe(function(response) {
      if (response.body.code == 200) {
        transports.closeDialog("okNTransport");
      } else {
        transports.toastr.error(response.body.message, "", { timeOut: 2000 });
        return;
      }
    });
  }

}
