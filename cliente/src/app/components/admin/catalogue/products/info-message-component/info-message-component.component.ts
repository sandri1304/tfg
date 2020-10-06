import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';

@Component({
  selector: 'app-info-message-component',
  templateUrl: './info-message-component.component.html',
  styleUrls: ['./info-message-component.component.css']
})
export class InfoMessageComponentComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<InfoMessageComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    ) { }

  ngOnInit() {

  }


}
