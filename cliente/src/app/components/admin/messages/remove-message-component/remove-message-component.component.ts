import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { MessageServiceService } from '../../../../services/admin/messages/message-service.service';

@Component({
  selector: 'app-remove-message-component',
  templateUrl: './remove-message-component.component.html',
  styleUrls: ['./remove-message-component.component.css']
})
export class RemoveMessageComponentComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveMessageComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dMessageSrv: MessageServiceService,) { }

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  removeMessage(): void {
    let me = this;

    this.dMessageSrv.removeMessage(this.data._id).subscribe(function(res){
      if (res.body.code == 200) {
        me.closeDialog("ok");
      } else {
        me.closeDialog("ko");
      }
    })
  }

}
