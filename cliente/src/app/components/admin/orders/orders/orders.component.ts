import { Component, AfterViewInit, ViewChild } from '@angular/core';

//import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { OrdersServiceService } from '../../../../services/admin/orders/orders-service.service';
import { Orders, OrdersArray } from 'src/app/dataModels/interfacesOrders';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { OrdersInfoComponent } from '../orders/orders-info/orders-info.component';
import { InvoicesServiceService } from '../../../../services/admin/orders/invoices-service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements AfterViewInit {

  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //ordenacion
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //columnas de la tabla
  displayedColumns: string[] = ['idPedido', 'fechaEntrada', 'fechaEntrega', 'estado', 'usuario', 'info'];
  //datos de la tabla
  data: Orders[] = [];

  //filtros
  filters = new FormGroup({
    idOrders: new FormControl(''),
    status: new FormControl(''),
    entryDate: new FormControl(''),
    email: new FormControl(''),
  });

  //propiedades de la tabla
  resultsLength = 0;
  loadingData = true;
  errorLoadingData = false;
  //promesa de la busqueda
  observer = null;
  invoice;
  orders = {};

  defaultActive= 'fechaEntrada';

  constructor(public dialog: MatDialog, 
              private dOrdersSrv: OrdersServiceService,
              private toastr: ToastrService,
              private dInvoicesSrv: InvoicesServiceService
    ) { }

  ngAfterViewInit() {
    // suscribe al cambio de orden --> mostramos la primera pagina
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.defaultActive = null;

    });


    //cargamos datos al entrar
    this.getDatos(this.getParams());
  }

  //devuelve objeto con los valores de los filtros
  private getParams() {
    let params = {
      idOrders: this.filters.value.idOrders,
      status: this.filters.value.status,
      entryDate: this.filters.value.entryDate,
      email: this.filters.value.email
    };
    return params;
  }

    //rellena la tabla
  getDatos(params) {
    this.observer = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingData = true;
          return this.dOrdersSrv!.getOrders(
            this.defaultActive != null ? this.defaultActive : this.sort.active,
            this.defaultActive != null ? "desc" : this.sort.direction,
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
    ).subscribe(data => this.data = data)
  }

  //cerrar mensaje de error cuando no se pueden cargar datos
  closeError() {
    this.errorLoadingData = false;
  }

  onRefresh() {
    this.observer.complete();
    this.getDatos(this.getParams());
  }

  onCleanFilters() {
    this.filters.reset();
  }

  //
  //botones de los filtros
  //
  searchFor() {
    //se completa la promesa para no cargar n veces
    this.observer.complete();
    this.paginator.pageIndex = 0;
    this.getDatos(this.getParams());
  }

  onExportExcel() {
    this.dOrdersSrv.getOrdersExcel(
      this.sort.active,
      this.sort.direction,
      this.getParams()
    ).subscribe(this.downloadFile);
  }

  downloadFile(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `pedidos.xlsx`);
  }

  onInfoClick(row) {
    this.openDialogInfo(row);

  }

  //abre la ventana de borrado de clientes
  openDialogInfo(num): void {
    let position: DialogPosition = {};
    position.top="85px";
    var dataC = Object.assign({},num);
    const dialogRef = this.dialog.open(OrdersInfoComponent, {
      width: '800px',
      height: '80%',
      disableClose:true,
      position: position,
      data: dataC,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        this.toastr.success("El pedido seleccionado se ha actualizado correctamente.", "", {
          timeOut: 2000
        });
        this.onRefresh();
      } else if (result == "ko") {
        this.toastr.error("La actualización del estado no es correcta", "", {
          timeOut: 2000
        });
      } else if (result == "koU") {
        this.toastr.error("No se ha podido actualizar el pedido seleccionado", "", {
          timeOut: 2000
        });
      }
    });
  }

  addInvoice(row){
    this.orders = row;
    let me = this;
    this.dInvoicesSrv.addInvoice(row).subscribe(response => {
      me.setMessage(response, me);
    });
  }

  setMessage(response, me) {
    if(response.body.code ==200){
      me.toastr.success("La factura se ha generado correctamente", "", {
        timeOut: 3000
      });
    } else {
      me.toastr.error(response.body.message, "", {
        timeOut: 3000
      });
    }
  }

}
