import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { TransportsServiceService } from 'src/app/services/admin/customerService/transports-service.service';
import { PaymentsServiceService } from 'src/app/services/admin/customerService/payments-service.service';
import { RemovePaymentComponent } from '../remove-payment/remove-payment.component';
import { RemoveTransportComponent } from '../remove-transport/remove-transport.component';
import { DetailPaymentComponent } from '../detail-payment/detail-payment.component';
import { DetailTransportComponent } from '../detail-transport/detail-transport.component';
import { Payments } from 'src/app/dataModels/interfacesPayments';
import { Transports } from 'src/app/dataModels/interfacesTransports';


@Component({
  selector: 'app-customer-service-component',
  templateUrl: './customer-service-component.component.html',
  styleUrls: ['./customer-service-component.component.css']
})
export class CustomerServiceComponentComponent implements AfterViewInit {

  //paginacion
  @ViewChild('paginatorPayments', { static: true }) paginatorPayments: MatPaginator;
  @ViewChild('paginatorTransports', { static: true }) paginatorTransports: MatPaginator;

  //ordenacion
  @ViewChild('sortPayments', { static: false }) sortPayments: MatSort;
  @ViewChild('sortTransports', { static: false }) sortTransports: MatSort;

  //columnas de la tabla
  displayedColumnsPayments: string[] = ['nombre', 'logo', 'info'] ;
  displayedColumnsTransports: string[] = ['nombre', 'info'] ;

  //datos de la tabla
  dataPayments: Payments[] = [];
  dataTransports: Transports[] = [];

  //filtros
  filtersPayments = new FormGroup({
    nombre: new FormControl(''),
  });
  filtersTransports = new FormGroup({
    nombre: new FormControl('')
  });

  //propiedades de la tabla
  resultsLengthPayments = 0;
  loadingData  = true;
  errorLoadingData  = false;

  resultsLengthTransports = 0;
  loadingDataTransports = true;
  errorLoadingDataTransports = false;

  //promesa de la busqueda
  observerPayments = null;
  observerTransports = null;
  res: string;


  constructor(public dialog: MatDialog, private paymentsSrv: PaymentsServiceService, private transportsSrv: TransportsServiceService, private toastr: ToastrService) { }

  ngAfterViewInit() {
    this.sortPayments.sortChange.subscribe(() => this.paginatorPayments.pageIndex = 0);
    this.sortTransports.sortChange.subscribe(() => this.paginatorTransports.pageIndex = 0);
    //cargamos datos al entrar
    this.getDatosPayments(this.getParams(this.filtersPayments));
    this.getDatosTransports(this.getParams(this.filtersTransports));
  }

  //devuelve objeto con los valores de los filtros
  private getParams(filters) {
    let params = {
      nombre: filters.value.nombre,
    };
    return params;
  };

  //cerrar mensaje de error cuando no se pueden cargar datos
  closeError() {
    this.errorLoadingData = false;
  }

  onCleanFiltersPayments() {
    this.filtersPayments.reset();
  }

  onRefreshPayments() {
    this.observerPayments.complete();
    this.getDatosPayments(this.getParams(this.filtersPayments));
  }

  onCleanFiltersTransports() {
    this.filtersTransports.reset();
  }

  onRefreshTransports() {
    this.observerTransports.complete();
    this.getDatosTransports(this.getParams(this.filtersTransports));
  }

  //
  //botones de los filtros
  //
  SearchForPayments() {
    //se completa la promesa para no cargar n veces
    this.observerPayments.complete();
    this.paginatorPayments.pageIndex = 0;
    this.getDatosPayments(this.getParams(this.filtersPayments));
  }

  SearchForTransports() {
    //se completa la promesa para no cargar n veces
    this.observerTransports.complete();
    this.paginatorTransports.pageIndex = 0;
    this.getDatosTransports(this.getParams(this.filtersTransports));
  }

  //Exportacion Tabla
  onExportExcelPayments() {
    this.paymentsSrv.getPaymentsExcel(
      this.sortPayments.active,
      this.sortPayments.direction,
      this.getParams(this.filtersPayments)
    ).subscribe(this.downloadFilePayments);
  }

  //Exportacion Tabla
  onExportExcelTransports() {
    this.transportsSrv.getTransportsExcel(
      this.sortTransports.active,
      this.sortTransports.direction,
      this.getParams(this.filtersTransports)
    ).subscribe(this.downloadFileTranspors);
  }

  downloadFilePayments(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `pagos.xlsx`);
  }

  downloadFileTranspors(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `transportes.xlsx`);
  }

  onRemovePayment(num) {
    this.openDialog(num, RemovePaymentComponent, '600px', '200px');
  }

  onRemoveTransport(num) {
    this.openDialog(num, RemoveTransportComponent, '600px', '200px');
  }

  onAddPayment() {
    let payment ="";
    this.openDialog(payment, DetailPaymentComponent,'600px', '305px');
  }

  onAddTransport() {
    let transport ="";
    this.openDialog(transport, DetailTransportComponent, '375px', '205px');
  }

  //abre la ventana de borrado de productos
  openDialog(num, component, x, y): void {
    let position: DialogPosition = {};
    position.top="85px";
    var dataC = Object.assign({},num);
    const dialogRef = this.dialog.open(component, {
      width: x,
      height: y,
      disableClose:true,
      position: position,
      data: dataC,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "okPayment") {
        this.toastr.success("Se ha borrado correctamente el método de pago seleccionado", "", {
          timeOut: 2000
        });
        this.onRefreshPayments();
      } else if (result == "koPayment") {
        this.toastr.error("No se ha podido borrar el método de pago seleccionado", "", {
          timeOut: 2000
        });
      } else if (result == "okTransport") {
        this.toastr.success("Se ha borrado correctamente la empresa de transporte seleccionada", "", {
          timeOut: 2000
        });
        this.onRefreshTransports();
      } else if (result == "koTransport") {
        this.toastr.error("No se ha podido borrar la empresa de transporte seleccionada", "", {
          timeOut: 2000
        });
      } else if (result == "okNTransport") {
        this.toastr.success("Empresa de transporte guardada correctamente", "", {
          timeOut: 2000
        });
        this.onRefreshTransports();
      } else if (result == "okNPayment") {
        this.toastr.success("Método de pago guardado correctamente", "", {
          timeOut: 2000
        });
        this.onRefreshPayments();
      }
    });
  };

  getDatosTransports(params) {
    this.observerTransports = merge(this.sortTransports.sortChange, this.paginatorTransports.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.loadingData = true;
        return this.transportsSrv!.getTransports(
        this.sortTransports.active,
        this.sortTransports.direction,
        this.paginatorTransports.pageIndex,
        this.paginatorTransports.pageSize,
        params);
      }),
      map(data => {
        this.loadingData = false;
        this.errorLoadingData = false;
        this.resultsLengthTransports = data.total_count;
        return data.items;
      }),
      catchError(() => {
        this.loadingData= false;
        this.errorLoadingData = true;
        return observableOf([]);
      })
    ).subscribe(data => this.dataTransports = data);
  };

  getDatosPayments(params) {
    this.observerPayments = merge(this.sortPayments.sortChange, this.paginatorPayments.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.loadingData = true;
        return this.paymentsSrv!.getPayments(
        this.sortPayments.active,
        this.sortPayments.direction,
        this.paginatorPayments.pageIndex,
        this.paginatorPayments.pageSize,
        params);
      }),
      map(data => {
        this.loadingData = false;
        this.errorLoadingData = false;
        this.resultsLengthPayments = data.total_count;
        return data.items;
      }),
      catchError(() => {
        this.loadingData = false;
        this.errorLoadingData = true;
        return observableOf([]);
      })
    ).subscribe(data => this.dataPayments = data);
  };



}
