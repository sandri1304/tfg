import { OnInit, ViewChild,  AfterViewInit  } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl,FormBuilder } from '@angular/forms';
import { Invoices } from 'src/app/dataModels/interfacesInvoices';
import { InvoicesServiceService } from '../../../../../services/admin/orders/invoices-service.service';
import { Products } from '../../../catalogue/interfacesProducts';

import { MatPaginator } from '@angular/material/paginator';
import { OrdersServiceService } from '../../../../../services/admin/orders/orders-service.service';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoices-detail',
  templateUrl: './invoices-detail.component.html',
  styleUrls: ['./invoices-detail.component.css']
})
export class InvoicesDetailComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //columnas de la tabla
  displayedColumns: string[] = ['codigo', 'articulo', 'marca', 'modelo', 'cantidad','precio'/*, 'actions'*/];
  //datos de la tabla
  dataTable = [];
  dataProducts: Products[] = [];

  //propiedades de la tabla
  loadingData = true;
  errorLoadingData = false;
  errorUpdateOrder = false;
  errorFormat = {};
  total:number = 0;

  cantidad =[];

  invoice = new FormGroup({
    nFactura: new FormControl(''),
    fecha: new FormControl(''),
    cliente: new FormControl('')
  });

  //propiedades de la tabla
  resultsLength = 0;

  //promesa de la busqueda
  observer = null;

  constructor(
    public dialogRef: MatDialogRef<InvoicesDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dInvoicesSrv: InvoicesServiceService,
    private invoiceFormBuilder: FormBuilder,
    private dOrdersSrv: OrdersServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.total = this.data.total;
  }

  ngAfterViewInit()  {
    this.loadingData = true;
    let dateSer = new Date(this.data.fecha);
    let dateFormat = (dateSer.getDate().toString().length == 1) ? "0" + dateSer.getDate() : dateSer.getDate();
    let monthFormat = ((dateSer.getMonth() + 1).toString().length == 1) ? "0" + (dateSer.getMonth() + 1) :  dateSer.getMonth() + 1;
    let dateCli = dateSer.getFullYear() + "-" + monthFormat + "-" + dateFormat;
    this.data.articulos.map(i => this.cantidad[i.articulo] = i.cantidad);

    
    let invoices = {
      nFactura: this.data.nFactura,
      fecha: dateCli,
      cliente: this.data.cliente.correo
    }
    this.invoice = this.invoiceFormBuilder.group(invoices);
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    
    this.getDatos(this.getParams());

    
  }

  //rellena la tabla
 getDatos(params) {
    this.observer = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingData = true;
          return this.dOrdersSrv!.getOrdersProducts(
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
      ).subscribe(data => this.addCantidad(data)   );
    }

  private addCantidad(data){
    console.log(data);
    data.map(i => {
      i.cantidad = this.cantidad[i._id]
      if (i.ofertas != null ) {
        i.pvp = Math.round((i.pvp - (i.pvp * i.ofertas.descuento) / 100.00)*100)/100;
      }
    });
    this.dataProducts = data
  }

  private getParams() {
    let params = this.data.articulos.map(i => i.articulo);
    return params.toString();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getPriceTotal() {
    return this.total;
  }

  closeError() {
    this.errorLoadingData = false;
  }

  setMessage(response, context) {
    if(response.body.code == 200 ) {
      context.toastr.success("Se ha generado el PDF de la factura", "", {
        timeOut: 3000
      });
    } else {
      context.toastr.error("No se ha podido generar el pdf de la factura", "", {
        timeOut: 3000
      });
    }
  }

}
