import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { ClientsServiceService } from 'src/app/services/admin/clients/clients-service.service';

@Component({
  selector: 'app-remove-client-component',
  templateUrl: './remove-client-component.component.html',
  styleUrls: ['./remove-client-component.component.css']
})
export class RemoveClientComponentComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveClientComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dClientsSrv: ClientsServiceService,
    ) { }

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  removeClient(): void {
    let me = this;
    debugger;
    this.dClientsSrv.removeClient(this.data._id, this.data.clientes._id).subscribe(function(res){
      if (res.body.code == 200) {
        me.closeDialog("ok");
      } else {
        me.closeDialog("ko");
      }
    })
  }

}
