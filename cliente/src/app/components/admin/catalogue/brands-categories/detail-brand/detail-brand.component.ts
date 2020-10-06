import { Component, OnInit, Inject,ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { BrandsServiceService } from '../../../../../services/admin/brands/brands-service.service';
import { Brands } from '../../../../../dataModels/interfacesBrands';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-brand',
  templateUrl: './detail-brand.component.html',
  styleUrls: ['./detail-brand.component.css']
})
export class DetailBrandComponent implements OnInit {

  messageError: string;
  errorFormat: {};
  errorNewBrand: boolean;
  @ViewChild("imagefile", { static: false }) imagefile: ElementRef;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetailBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dbrandSrv: BrandsServiceService,
    private toastr: ToastrService
  ) { }

  brand = new FormGroup({
    nombre: new FormControl(''),
  });

  imagen: string | ArrayBuffer = null;

  ngOnInit() {
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  saveBrand() {
    // let newBrand = {
    //   nombre: this.brand.value.nombre
    // };

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

    if(this.brand.value.nombre == null) {
      this.toastr.error("Es necesario una nombre para la marca", "", { timeOut: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.imagefile.nativeElement.files[0]);
    formData.append('nombre', this.brand.value.nombre);
    let brands = this;

    this.dbrandSrv.saveBrand(formData).subscribe(function(response) {
      if (response.body.code == 200) {
        brands.closeDialog("okNB");
      } else {
        brands.toastr.error(response.body.message, "", { timeOut: 2000 });
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
