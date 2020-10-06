import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { ProductsServiceService } from '../../../../../services/admin/products/products-service.service';
import { Products } from '../../interfacesProducts';

@Component({
  selector: 'app-remove-product-componente',
  templateUrl: './remove-product-componente.component.html',
  styleUrls: ['./remove-product-componente.component.css']
})
export class RemoveProductComponenteComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveProductComponenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Products,
    private dProductsSrv: ProductsServiceService,
    ) { }

  ngOnInit() {

  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }


  removeProduct(): void {
    let me = this;
    this.dProductsSrv.removeProduct(this.data._id).subscribe(function(res){
      if (res.body.code == 200) {
        me.closeDialog("ok");
      } else {
        me.closeDialog("ko");
      }
    })
  }

}
