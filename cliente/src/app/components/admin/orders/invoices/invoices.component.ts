import { Component, AfterViewInit, ViewChild } from '@angular/core';

//import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { InvoicesDetailComponent } from 'src/app/components/admin/orders/invoices/invoices-detail/invoices-detail.component';
import { InvoicesServiceService } from '../../../../services/admin/orders/invoices-service.service';
import { Invoices, ArrayInvoices } from 'src/app/dataModels/interfacesInvoices';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { Properties } from 'src/app/dataModels/properties';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements AfterViewInit {

  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //ordenacion
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //columnas de la tabla
  displayedColumns: string[] = ['nFactura', 'fecha', 'cliente', 'info'];
  //datos de la tabla
  data: Invoices[] = [];
  nFactura;

  //filtros
  filters = new FormGroup({
    nFactura: new FormControl(''),
    fecha: new FormControl(''),
    cliente: new FormControl('')
  });

  //propiedades de la tabla
  resultsLength = 0;
  loadingData = true;
  errorLoadingData = false;
  //promesa de la busqueda
  observer = null;

  constructor(public dialog: MatDialog, private dInvoicesSrv: InvoicesServiceService,private toastr: ToastrService) {}

  ngAfterViewInit() {
    // suscribe al cambio de orden --> mostramos la primera pagina
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    //cargamos datos al entrar
    this.getDatos(this.getParams());
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

  onCleanFilters() {
    this.filters.reset();
  }

  onRefresh() {
    this.observer.complete();
    this.getDatos(this.getParams());
  }

  onExportExcel() {
    this.dInvoicesSrv.getInvoicesExcel(
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

  //
  //funciones internas
  //

  downloadFile(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `facturas.xlsx`);
  }

  //devuelve objeto con los valores de los filtros
  private getParams() {
    let params = {
      nFactura: this.filters.value.nFactura,
      cliente: this.filters.value.cliente,
      fecha: this.filters.value.fecha
    };
    return params;
  }

  //cerrar mensaje de error cuando no se pueden cargar datos
  closeError() {
    this.errorLoadingData = false;
  }

  //rellena la tabla
  getDatos(params) {
    this.observer = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingData = true;
          return this.dInvoicesSrv!.getInvoices(
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

  //abre la ventana de detalles
  openDialog(invoice): void {
    let position: DialogPosition = {};
    position.top="85px";
    const dialogRef = this.dialog.open(InvoicesDetailComponent, {
      width: '800px',
      height: '70%',
    //   disableClose:true,
      position: position,
      data: invoice,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  createPDF(row){
    this.nFactura =  row.nFactura;
    let me = this;
    this.dInvoicesSrv.pdfCreatorInvoice(row).subscribe(function(response) {
      me.setMessage(response, me);
    })
  }


    setMessage(response, context) {
      if(response.body.code == 200 ) {
        context.toastr.success("Se ha generado el PDF de la factura", "", {
          timeOut: 3000
        });
        let filename =  context.nFactura+".pdf";
        //http://localhost:8080/nevado/static/pdfs/1.pdf
        window.open(Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_server_pdfs +"/" + filename, "_blank");
      } else {
        context.toastr.error("No se ha podido generar el pdf de la factura", "", {
          timeOut: 3000
        });
      }
    }

}
