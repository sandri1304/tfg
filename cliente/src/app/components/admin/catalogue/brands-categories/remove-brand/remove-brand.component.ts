import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { BrandsServiceService } from '../../../../../services/admin/brands/brands-service.service';
import { Brands } from '../../../../../dataModels/interfacesBrands';

@Component({
  selector: 'app-remove-brand',
  templateUrl: './remove-brand.component.html',
  styleUrls: ['./remove-brand.component.css']
})
export class RemoveBrandComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dbrandSrv: BrandsServiceService,
  ) { }

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  removeBrand(): void {
    let me = this;
    this.dbrandSrv.removeBrand(this.data._id).subscribe(function(res){
      if (res.body.code == 200) {
        me.closeDialog("okB");
      } else {
        me.closeDialog("koB");
      }
    })
  }

}

