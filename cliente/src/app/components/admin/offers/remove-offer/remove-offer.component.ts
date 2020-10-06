import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { OffersServiceService } from 'src/app/services/admin/offers/offers-service.service';


@Component({
  selector: 'app-remove-offer',
  templateUrl: './remove-offer.component.html',
  styleUrls: ['./remove-offer.component.css']
})
export class RemoveOfferComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dOffersSrv: OffersServiceService,
  ) { }

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  removeOffer(): void {
    let me = this;
    this.dOffersSrv.removeOffer(this.data._id).subscribe(function(res){
      if (res.body.code == 200) {
        me.closeDialog("okO");
      } else {
        me.closeDialog("koO");
      }
    })
  }
}
