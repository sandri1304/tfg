import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { CategoriesServiceService } from '../../../../../services/admin/categories/categories-service.service';
import { Categories } from '../../../../../dataModels/interfacesCategories';

@Component({
  selector: 'app-remove-category',
  templateUrl: './remove-category.component.html',
  styleUrls: ['./remove-category.component.css']
})
export class RemoveCategoryComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dCategoriesSrv: CategoriesServiceService,
  ) { }

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }


  removeCategory(): void {
    let me = this;
    this.dCategoriesSrv.removeCategory(this.data._id).subscribe(function(res){
      if (res.body.code == 200) {
        me.closeDialog("okC");
      } else {
        me.closeDialog("koC");
      }
    })
  }

}
