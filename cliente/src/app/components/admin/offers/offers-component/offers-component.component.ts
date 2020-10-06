import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { OffersServiceService } from '../../../../services/admin/offers/offers-service.service';
import { Offers, OffersArray } from 'src/app/dataModels/interfacesOffers';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { OffersInfoComponent } from '../offers-info/offers-info.component';
import { RemoveOfferComponent } from '../remove-offer/remove-offer.component';

@Component({
  selector: 'app-offers-component',
  templateUrl: './offers-component.component.html',
  styleUrls: ['./offers-component.component.css']
})
export class OffersComponentComponent implements AfterViewInit {

  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //ordenacion
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //columnas de la tabla
  displayedColumns: string[] = ['idOferta', 'descuento', 'fechaInicio', 'fechaFin', 'info'];
  //datos de la tabla
  data: Offers[] = [];

  //filtros
  filters = new FormGroup({
    idOffer: new FormControl(''),
    discount: new FormControl(''),
    initDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  //propiedades de la tabla
  resultsLength = 0;
  loadingData = true;
  errorLoadingData = false;
  //promesa de la busqueda
  observer = null;

  defaultActive= 'fechaInicio';


  constructor(public dialog: MatDialog, private dOffersSrv: OffersServiceService, private toastr: ToastrService) { }

  ngAfterViewInit() {
    // suscribe al cambio de orden --> mostramos la primera pagina
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.defaultActive = null;
    });
    this.getDatos(this.getParams());
  }

  private getParams() {
    let params = {
      idOffer: this.filters.value.idOffer,
      discount: this.filters.value.discount,
      initDate: this.filters.value.initDate,
      endDate: this.filters.value.endDate
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
          return this.dOffersSrv!.getOffers(
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
    this.dOffersSrv.getOffersExcel(
      this.sort.active,
      this.sort.direction,
      this.getParams()
    ).subscribe(this.downloadFile);
  }

  downloadFile(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `ofertas.xlsx`);
  }

  onInfoClick(row) {
    this.openDialog(row, OffersInfoComponent, '800px', '305px');
  }

  onAddOffer() {
    let offer ="";
    this.openDialog(offer, OffersInfoComponent, '800px', '305px');
  }

  onRemoveOffer(num) {
    this.openDialog(num, RemoveOfferComponent, '600px', '200px');
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
      if (result == "okO") {
        this.toastr.success("Oferta borrada correctamente", "", {
          timeOut: 2000
        });
        this.onRefresh();
      } else if (result == "koO") {
        this.toastr.error("No se ha podido borrar la oferta seleccionada", "", {
          timeOut: 2000
        });
      } else if (result == "okNO") {
        this.toastr.success("Oferta guardada correctamente", "", {
          timeOut: 2000
        });
        this.onRefresh();
      } else if (result == "okUO") {
        this.toastr.success("Oferta actualizada correctamente", "", {
          timeOut: 2000
        });
        this.onRefresh();
      }
    });
  };

}
