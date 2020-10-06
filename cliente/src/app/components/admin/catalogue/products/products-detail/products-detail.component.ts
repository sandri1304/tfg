import { OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';

import { Products } from 'src/app/components/admin/catalogue/interfacesProducts';
import { Properties } from 'src/app/dataModels/properties';
import { ProductsServiceService } from '../../../../../services/admin/products/products-service.service';
import { BrandsServiceService } from '../../../../../services/admin/brands/brands-service.service';
import { CategoriesServiceService } from '../../../../../services/admin/categories/categories-service.service';
import { OffersServiceService } from '../../../../../services/admin/offers/offers-service.service';
import { Brands } from 'src/app/dataModels/interfacesBrands';
import { Categories } from 'src/app/dataModels/interfacesCategories';
import { Offers } from 'src/app/dataModels/interfacesOffers';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.css']
})
export class ProductsDetailComponent implements OnInit {

  //ordenacion
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("imagefile", { static: false }) imagefile: ElementRef;



  marcas: Brands[];
  categorias: Categories[];
  ofertas: Offers[];
  messageError: string;
  errorFormat: {};

  //propiedades de la tabla
  loadingData = false;
  errorLoadingData = false;
  errorSaveProdcut = false;
  errorUpdateProduct = false;


  //imagen = '/assets/MCSA01857600_3TS988BP_def.jpg';
  imagen2='/assets/IMG_0054.jpg';
  imagen: string | ArrayBuffer = null;

  product = new FormGroup({
    categoria: new FormControl(''),
    modelo: new FormControl(''),
    marca: new FormControl(''),
    codigoArticulo: new FormControl(''),
    caracteristicas: new FormControl(''),
    caracteristicas2: new FormControl(''),
    otros: new FormControl(''),
    pvp: new FormControl(''),
    pvpTarifa: new FormControl(''),
    stock: new FormControl(''),
    oferta: new FormControl(''),
    estado: new FormControl(''),
    fechaPublicacion : new FormControl(''),
    fechaModificacion: new FormControl(''),
    imagen: new FormControl(''),
    file: new FormControl(''),
    envioGratuito: new FormControl('')
  });


  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
};



  estrellas:number;
  usuarios: number;
  comentarios;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProductsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Products,
    private dProductsSrv: ProductsServiceService,
    private dbBrandsSrv:  BrandsServiceService,
    private dbCategoriesSrv: CategoriesServiceService,
    private dbOffersSrv: OffersServiceService,
    private productFormBuilder: FormBuilder,
    private toastr: ToastrService ) {
  }


   ngOnInit() {

    var me = this;


    if (this.data._id != null) {
      var a = this.dProductsSrv.getProductsById(this.data._id)
      .subscribe(datos => {this.setFormData(datos, me)});


    };

    this.dbBrandsSrv.getBrandsProducts().subscribe(function(brands){
      me.marcas = brands;
    });

    this.dbCategoriesSrv.getCategoriesProducts().subscribe(function(categories){
      me.categorias = categories;
    });

    this.dbOffersSrv.getOffersProducts().subscribe(function(offers) {
      me.ofertas = offers;
    })
  }

  setFormData(datos, context){
    let ofertas = datos.ofertas;
    if(ofertas != null){
      delete datos.ofertas;
      datos.oferta = ofertas._id;
    }else{
      datos.oferta = null;
    }

    context.imagen = Properties.nevado_client_localhost + datos.imagen;
    context.product = context.productFormBuilder.group(datos);
  }



  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  closeError() {
    this.errorLoadingData = false;
  }

  saveProduct() {

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

    const formData = new FormData();
    formData.append('file', this.imagefile.nativeElement.files[0]);
    formData.append('_id', this.data._id);
    formData.append('codigoArticulo', this.product.value.codigoArticulo);
    formData.append('categoria', this.product.value.categoria);
    formData.append('marca', this.product.value.marca);
    formData.append('modelo', this.product.value.modelo);
    formData.append('pvpTarifa', this.product.value.pvpTarifa);
    formData.append('pvp', this.product.value.pvp);
    if(this.product.value.estado != null){
      formData.append('estado', this.product.value.estado);
    }
    if(this.product.value.envioGratuito != null) {
      formData.append('envioGratuito', this.product.value.envioGratuito);
    }
    formData.append('stock', this.product.value.stock);
    if(this.product.value.oferta == null) {
      formData.append('oferta', "");
    } else {
      formData.append('oferta', this.product.value.oferta);
    }
    formData.append('fechaModificacion', this.product.value.fechaModificacion);
    formData.append('fechaPublicacion', this.product.value.fechaPublicacion);
    formData.append('autor', this.product.value.autor);
    formData.append('caracteristicas', this.product.value.caracteristicas);
    formData.append('otros', this.product.value.otros);

    let id = this.data._id;
    let products = this;
    if(id != null){
      this.dProductsSrv.updateProductById(id, formData).subscribe(response => {
        if (response.body.code == 200) {
          products.closeDialog("okU");
        } else {
          products.toastr.error(response.body.message, "", {
            timeOut: 2000
          });
          return;
        }
      })
    }else{
      formData.append('estrellas', "0");
      formData.append('usuarios', "0");
      formData.append('ventas', "0");
      this.dProductsSrv.saveProduct(formData).subscribe(function(response) {
        if (response.body.code == 200) {
          products.closeDialog("okC");
        } else {
          products.toastr.error(response.body.message, "", {
            timeOut: 2000
          });
          return;
        };
      });
    };
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


