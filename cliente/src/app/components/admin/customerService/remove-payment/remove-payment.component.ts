import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { PaymentsServiceService } from 'src/app/services/admin/customerService/payments-service.service';

@Component({
  selector: 'app-remove-payment',
  templateUrl: './remove-payment.component.html',
  styleUrls: ['./remove-payment.component.css']
})
export class RemovePaymentComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemovePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dPaymentsSrv: PaymentsServiceService,
  ) { }

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  removePayment(): void {
    let me = this;
    this.dPaymentsSrv.removePayment(this.data._id).subscribe(function(res){
      if (res.body.code == 200) {
        me.closeDialog("okPayment");
      } else {
        me.closeDialog("koPayment");
      }
    })
  }

}
