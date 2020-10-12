import { Component, AfterViewInit, ViewChild } from '@angular/core';

//import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { RemoveProductComponenteComponent } from 'src/app/components/admin/catalogue/products/remove-product-componente/remove-product-componente.component';
import { ProductsServiceService } from '../../../../services/admin/products/products-service.service';
import { Products, ProductsArray } from 'src/app/components/admin/catalogue/interfacesProducts';
import { ProductsDetailComponent } from '../products/products-detail/products-detail.component';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements AfterViewInit {


  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //ordenacion
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //columnas de la tabla
  displayedColumns: string[] = ['codigoArticulo', 'categoria', 'marca', 'modelo', 'pvp', 'stock', 'info'] ;
  //datos de la tabla
  data: Products[] = [];

  //filtros
  filters = new FormGroup({
    codigoArticulo: new FormControl(''),
    marca: new FormControl(''),
    categoria: new FormControl(''),
    stprecioock: new  FormControl(''),
    pvp: new FormControl('')
  });

  //propiedades de la tabla
  resultsLength = 0;
  loadingData = true;
  errorLoadingData = false;
  //promesa de la busqueda
  observer = null;
  res: string;

  constructor(public dialog: MatDialog, private productsSrv: ProductsServiceService,private toastr: ToastrService) { }

  ngAfterViewInit() {
    // suscribe al cambio de orden --> mostramos la primera pagina
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    //cargamos datos al entrar
    this.getDatos(this.getParams());
  }

  //
  //botones de los filtros
  //
  buscar() {
    //se completa la promesa para no cargar n veces
    this.observer.complete();
    this.paginator.pageIndex = 0;
    this.getDatos(this.getParams());
  }

  //devuelve objeto con los valores de los filtros
  private getParams() {
    let params = {
      codigoArticulo: this.filters.value.codigoArticulo,
      marca: this.filters.value.marca,
      categoria: this.filters.value.categoria,
      pvp: this.filters.value.pvp
    };
    return params;
  };

    //rellena la tabla
  getDatos(params) {
    this.observer = merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.loadingData = true;
        return this.productsSrv!.getProducts(
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize,
        params);
      }),
      map(data => {
        this.loadingData = false;
        this.errorLoadingData = false;
        this.resultsLength = data.total_count;
        return data.items;
      }),
      catchError(() => {
        this.loadingData = false;
        this.errorLoadingData = true;
        return observableOf([]);
       })
    ).subscribe(data => this.data = data);
  }

  //cerrar mensaje de error cuando no se pueden cargar datos
  closeError() {
    this.errorLoadingData = false;
  }

  onCleanFilters() {
    this.filters.reset();
  }

  onRefresh() {
    this.observer.complete();
    this.getDatos(this.getParams());
  }

  onExportExcel() {
    this.productsSrv.getProductsExcel(
      this.sort.active,
      this.sort.direction,
      this.getParams()
    ).subscribe(this.downloadFile);
  }

  //
  //botones de cada fila
  //
  onInfoClick(num) {
    this.openDialog(num);
  }

  onEditClick(num) {
    this.openDialog(num);
  }

  onAddProduct() {
    let product ="";
    this.openDialog(product);
  }
  downloadFile(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `products.xlsx`);
  }

  onRemoveProduct(num) {
    this.openDialogRemove(num);
  }

  //abre la ventana de detalles
  openDialog(product): void {
    let position: DialogPosition = {};
    position.top="85px";
    const dialogRef = this.dialog.open(ProductsDetailComponent, {
      width: '800px',
      height: '500px',
      disableClose:true,
      position: position,
      data: product,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "okC") {
        this.toastr.success("El artículo se ha guardado correctamente", "", {
          timeOut: 2000
        });
        this.onRefresh();
      } else if (result == "okU") {
        this.toastr.success("El artículo se ha actualizado correctamente", "", {
          timeOut: 2000
        });
        this.onRefresh();
      }
    });


  }

  //abre la ventana de borrado de productos
  openDialogRemove(num): void {
    let position: DialogPosition = {};
    position.top="85px";
    var dataC = Object.assign({},num);
    const dialogRef = this.dialog.open(RemoveProductComponenteComponent, {
      width: '600px',
      height: '200px',
      disableClose:true,
      position: position,
      data: dataC
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        this.toastr.success("Producto borrado correctamente", "", {
          timeOut: 2000
        });
        this.onRefresh();
      } else if (result == "ko") {
        this.toastr.error("No se ha podido borrar el producto seleccionado", "", {
          timeOut: 2000
        });
      }
    });


  }


}
