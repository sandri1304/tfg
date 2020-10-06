import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

import { BrandsServiceService } from '../../../../services/admin/brands/brands-service.service';
import { CategoriesServiceService } from '../../../../services/admin/categories/categories-service.service';
import { Brands, BrandsArray } from 'src/app/dataModels/interfacesBrands';
import { Categories, CategoriesArray } from 'src/app/dataModels/interfacesCategories';
import { Properties } from 'src/app/dataModels/properties';
import { RemoveBrandComponent } from 'src/app/components/admin/catalogue/brands-categories/remove-brand/remove-brand.component';
import { RemoveCategoryComponent } from 'src/app/components/admin/catalogue/brands-categories/remove-category/remove-category.component';
import { DetailBrandComponent } from 'src/app/components/admin/catalogue/brands-categories/detail-brand/detail-brand.component';
import { DetailCategoryComponent } from 'src/app/components/admin/catalogue/brands-categories/detail-category/detail-category.component';

@Component({
  selector: 'app-brands-categories',
  templateUrl: './brands-categories.component.html',
  styleUrls: ['./brands-categories.component.css']
})
export class BrandsCategoriesComponent implements AfterViewInit {

  //paginacion
  @ViewChild('paginatorBrands', { static: true }) paginatorBrands: MatPaginator;
  @ViewChild('paginatorCategories', { static: true }) paginatorCategories: MatPaginator;
  //ordenacion
  @ViewChild('sortBrands', { static: false }) sortBrands: MatSort;
  @ViewChild('sortCategories', { static: false }) sortCategories: MatSort;

  //columnas de la tabla
  displayedColumnsBrands: string[] = ['nombre', 'logo','info'] ;
  displayedColumnsCategories: string[] = ['nombre','categoriaGeneral','logo','info'] ;

  //datos de la tabla
  dataBrands: Brands[] = [];
  dataCategories: Categories[] = [];

  //filtros
  filtersBrands = new FormGroup({
    nombre: new FormControl('')
  });
  filtersCategories = new FormGroup({
    nombre: new FormControl('')
  });

  //propiedades de la tabla
  resultsLengthBrands = 0;
  loadingDataBrands = true;
  errorLoadingDataBrands = false;

  resultsLengthCategories = 0;
  loadingData = true;
  errorLoadingData = false;

  //promesa de la busqueda
  observerBrands = null;
  observerCategories = null;
  res: string;
  image: string;

  constructor(public dialog: MatDialog, private brandsSrv: BrandsServiceService, private categoriesSrv: CategoriesServiceService, private toastr: ToastrService) { }

  ngAfterViewInit() {
    this.sortBrands.sortChange.subscribe(() => this.paginatorBrands.pageIndex = 0);
    this.sortCategories.sortChange.subscribe(() => this.paginatorCategories.pageIndex = 0);
    //cargamos datos al entrar
    this.getDatosBrands(this.getParams(this.filtersBrands));
    this.getDatosCategories(this.getParams(this.filtersCategories));
  }

  //devuelve objeto con los valores de los filtros
  private getParams(filters) {
    let params = {
      nombre: filters.value.nombre,
    };
    return params;
  };

  //rellena la tabla
  getDatosBrands(params) {
    this.observerBrands = merge(this.sortBrands.sortChange, this.paginatorBrands.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.loadingData= true;
        return this.brandsSrv!.getBrands(
        this.sortBrands.active,
        this.sortBrands.direction,
        this.paginatorBrands.pageIndex,
        this.paginatorBrands.pageSize,
        params);
      }),
      map(data => {
        this.loadingData = false;
        this.errorLoadingData = false;
        this.resultsLengthBrands = data.total_count;
        //this.setImage(data, this);
        return data.items;
      }),
      catchError(() => {
        this.loadingData = false;
        this.errorLoadingData = true;
        return observableOf([]);
      })
    ).subscribe(data => this.dataBrands = data);
  };

  getDatosCategories(params) {
    this.observerCategories = merge(this.sortCategories.sortChange, this.paginatorCategories.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.loadingData = true;
        return this.categoriesSrv!.getCategories(
        this.sortCategories.active,
        this.sortCategories.direction,
        this.paginatorCategories.pageIndex,
        this.paginatorCategories.pageSize,
        params);
      }),
      map(data => {
        this.loadingData = false;
        this.errorLoadingData = false;
        this.resultsLengthCategories = data.total_count;
        return data.items;
      }),
      catchError(() => {
        this.loadingData = false;
        this.errorLoadingData = true;
        return observableOf([]);
      })
    ).subscribe(data => this.dataCategories = data);
  };

  //cerrar mensaje de error cuando no se pueden cargar datos
  closeError() {
    this.errorLoadingData = false;
  }

  onCleanFiltersBrands() {
    this.filtersBrands.reset();
  }

  onRefreshBrands() {
    this.observerBrands.complete();
    this.getDatosBrands(this.getParams(this.filtersBrands));
  }

  onCleanFiltersCategories() {
    this.filtersCategories.reset();
  }

  onRefreshCategories() {
    this.observerCategories.complete();
    this.getDatosCategories(this.getParams(this.filtersCategories));
  }

  //
  //botones de los filtros
  //
  SearchForBrands() {
    //se completa la promesa para no cargar n veces
    this.observerBrands.complete();
    this.paginatorBrands.pageIndex = 0;
    this.getDatosBrands(this.getParams(this.filtersBrands));
  }

  SearchForCategories() {
    //se completa la promesa para no cargar n veces
    this.observerCategories.complete();
    this.paginatorCategories.pageIndex = 0;
    this.getDatosCategories(this.getParams(this.filtersCategories));
  }

  //Exportacion Tabla
  onExportExcelBrands() {
    this.brandsSrv.getBrandsExcel(
      this.sortBrands.active,
      this.sortBrands.direction,
      this.getParams(this.filtersBrands)
    ).subscribe(this.downloadFileBrands);
  }

  //Exportacion Tabla
  onExportExcelCategories() {
    this.categoriesSrv.getCategoriesExcel(
      this.sortBrands.active,
      this.sortBrands.direction,
      this.getParams(this.filtersBrands)
    ).subscribe(this.downloadFileCategories);
  }

  downloadFileBrands(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `brands.xlsx`);
  }

  downloadFileCategories(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `categories.xlsx`);
  }

  onRemoveBrand(num) {
    this.openDialog(num, RemoveBrandComponent, '600px', '200px');
  }

  onRemoveCategory(num) {
    this.openDialog(num, RemoveCategoryComponent, '600px', '200px');
  }

  onAddBrand() {
    let brand ="";
    this.openDialog(brand, DetailBrandComponent,'600px', '305px');
  }

  onAddCategory() {
    let category ="";
    this.openDialog(category, DetailCategoryComponent, '600px', '305px');
  }

  //abre la ventana de borrado de productos
  openDialog(num, component, x, y): void {
    let position: DialogPosition = {};
    var dataC = Object.assign({},num);
    position.top="85px";
    const dialogRef = this.dialog.open(component, {
      width: x,
      height: y,
      disableClose:true,
      position: position,
      data: dataC,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "okC") {
        this.toastr.success("Categoria borrada correctamente", "", {
          timeOut: 2000
        });
        this.onRefreshCategories();
      } else if (result == "koC") {
        this.toastr.error("No se ha podido borrar la categoria seleccionada", "", {
          timeOut: 2000
        });
      } else if (result == "okB") {
        this.toastr.success("Marca borrada correctamente", "", {
          timeOut: 2000
        });
        this.onRefreshBrands();
      } else if (result == "koB") {
        this.toastr.error("No se ha podido borrar la marca seleccionada", "", {
          timeOut: 2000
        });
      } else if (result == "okNB") {
        this.toastr.success("Marca guardada correctamente", "", {
          timeOut: 2000
        });
        this.onRefreshBrands();
      } else if (result == "okNC") {
        this.toastr.success("Categoria guardada correctamente", "", {
          timeOut: 2000
        });
        this.onRefreshCategories();
      }
    });
  };

  setImage(data, context) {
    debugger;
    context.image = Properties.nevado_client_localhost + data.imagen;
  }
}
