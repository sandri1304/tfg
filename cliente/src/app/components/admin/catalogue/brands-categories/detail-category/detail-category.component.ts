import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { CategoriesServiceService } from '../../../../../services/admin/categories/categories-service.service';
import { Categories } from '../../../../../dataModels/interfacesCategories';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.component.html',
  styleUrls: ['./detail-category.component.css']
})
export class DetailCategoryComponent implements OnInit {

  messageError: string;
  errorFormat: {};
  errorNewCategory: boolean;

  categoriasGenerales =  [
    {nombre: 'Gran Electrodoméstico'},
    {nombre: 'Pequeño electrodoméstico de cocina'},
    {nombre: 'Imagen'},
    {nombre: 'Sonido'},
    {nombre: 'Telefonía y electrónica'},
    {nombre: 'Cuidado Personal'},
    {nombre: 'Limpieza'},
    {nombre: 'Climatización'},
    {nombre: 'Informática'},
  ];

  @ViewChild("imagefile", { static: false }) imagefile: ElementRef;

  imagen: string | ArrayBuffer = null;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetailCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dCategoriesSrv: CategoriesServiceService,
    private toastr: ToastrService
  ) { }

  category = new FormGroup({
    nombre: new FormControl(''),
    categoriaGeneral: new FormControl('')
  });

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  saveCategory() {
    /*let newCategory = {
      nombre: this.category.value.nombre,
      categoriaGeneral: this.category.value.categoriaGeneral
    };*/

    if (this.imagefile.nativeElement.files.length == 0) {
      this.toastr.error("Selecciona un fichero", "", { timeOut: 2000 });
      return;
    }
    if (this.imagefile.nativeElement.files.length > 1) {
      this.toastr.error("Solo se permite un fichero", "", { timeOut: 2000 });
      return;
    }
    if (!this.imagefile.nativeElement.files[0].name.endsWith('.png')
      && !this.imagefile.nativeElement.files[0].name.endsWith('.jpg')
      && !this.imagefile.nativeElement.files[0].name.endsWith('.jpeg')) {
      this.toastr.error("El fichero no tiene el formato esperado", "", { timeOut: 2000 });
      return;
    }

    if(this.category.value.nombre == null) {
      this.toastr.error("Es necesario una nombre para la categoria", "", { timeOut: 2000 });
      return;
    }

    if(this.category.value.categoriaGeneral == null) {
      this.toastr.error("Es necesario un grupo de categoria para la categoria", "", { timeOut: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.imagefile.nativeElement.files[0]);
    formData.append('nombre', this.category.value.nombre);
    formData.append('categoriaGeneral', this.category.value.categoriaGeneral);

    let categories = this;
    this.dCategoriesSrv.saveCategory(formData).subscribe(function(response) {
      if (response.body.code == 200) {
        categories.closeDialog("okNC");
      } else {
        categories.toastr.error(response.body.message, "", { timeOut: 2000 });
        return;
      }
    });
  }

  onImageChange(file: File){
    if (file ) {
      if(file.type.startsWith("image")){
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = event => {
          this.imagen = reader.result;
        };
      }

    }
  }

}
