import { Component, AfterViewInit, ViewChild } from '@angular/core';

//import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Orders, OrdersArray } from 'src/app/dataModels/interfacesOrders';

import { FrontServiceService } from  '../../../services/front/front-service.service';
import { UserServiceService } from  '../../../services/user-service.service';

@Component({
  selector: 'app-orders-profile-component',
  templateUrl: './orders-profile-component.component.html',
  styleUrls: ['./orders-profile-component.component.css']
})
export class OrdersProfileComponentComponent implements AfterViewInit {

  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //ordenacion
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //columnas de la tabla
  displayedColumns: string[] = ['idPedido', 'fechaEntrada', 'fechaEntrega', 'estado'];
  //datos de la tabla
  data: Orders[] = [];

  //filtros
  filters = new FormGroup({
    idOrders: new FormControl(''),
    status: new FormControl(''),
    entryDate: new FormControl(''),
  });

  idUser:string;
  

  //propiedades de la tabla
  resultsLength = 0;
  loadingData = true;
  errorLoadingData = false;
  //promesa de la busqueda
  observer = null;

  defaultActive= 'fechaEntrada';
  constructor(public dialog: MatDialog,
              public frontService: FrontServiceService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private userService: UserServiceService) { }

  ngAfterViewInit() {
    //this.userService.setPath(this.router.url);

    const url: Observable<string> = this.activeRoute.url.pipe(map(segments => segments.join('/')));;
    this.userService.setPreviousPath(JSON.parse(localStorage.getItem('currentPath')));
    url.subscribe(currentUrl => this.userService.setPath(currentUrl));

    this.idUser = this.activeRoute.snapshot.params.idUser;
    // suscribe al cambio de orden --> mostramos la primera pagina
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.defaultActive = null;  
          
    });
            
            
    //cargamos datos al entrar
    this.getDatos(this.getParams(), this.idUser);
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
    getDatos(params, idUser) {
      this.observer = merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.loadingData = true;
            return this.frontService!.getOrders(
              this.defaultActive != null ? this.defaultActive : this.sort.active,
              this.defaultActive != null ? "desc" : this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize,
              params, 
              idUser);
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
    this.getDatos(this.getParams(), this.idUser);
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
    this.getDatos(this.getParams(),this.idUser );
  }

  comeBack() {
    let urlComeBack = this.userService.getPreviousPath(); 
    // const url: Observable<string> = this.activeRoute.url.pipe(map(segments => segments.join('/')));;
    // this.userService.setPreviousPath(JSON.parse(localStorage.getItem('currentPath')));
    // url.subscribe(currentUrl => this.userService.setPath(currentUrl));
    this.userService.setPath(urlComeBack);
    this.userService.setPreviousPath(this.router.url);
    if (urlComeBack != null && urlComeBack != "") {
      this.router.navigate([urlComeBack]);
    } else {
      this.router.navigate(["/home"]);
    } 
  }

}
