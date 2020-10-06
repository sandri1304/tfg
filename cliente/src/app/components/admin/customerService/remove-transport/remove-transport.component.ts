import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { TransportsServiceService } from 'src/app/services/admin/customerService/transports-service.service';

@Component({
  selector: 'app-remove-transport',
  templateUrl: './remove-transport.component.html',
  styleUrls: ['./remove-transport.component.css']
})
export class RemoveTransportComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveTransportComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dTransportsSrv: TransportsServiceService,
  ) { }

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  removeTransport(): void {
    let me = this;
    this.dTransportsSrv.removeTransport(this.data._id).subscribe(function(res){
      if (res.body.code == 200) {
        me.closeDialog("okTransport");
      } else {
        me.closeDialog("koTransport");
      }
    })
  }

}
