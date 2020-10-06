import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';

@Component({
  selector: 'app-detail-photo-product',
  templateUrl: './detail-photo-product.component.html',
  styleUrls: ['./detail-photo-product.component.css']
})
export class DetailPhotoProductComponent implements OnInit {

  imagen: string | ArrayBuffer = null;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetailPhotoProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit() {
    this.imagen = this.data;
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

}
