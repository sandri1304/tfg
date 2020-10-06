import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { UserClient } from '../../../../dataModels/userclient';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { RemoveClientComponentComponent } from 'src/app/components/admin/clients/remove-client/remove-client-component/remove-client-component.component';
import { ClientInfoComponentComponent } from 'src/app/components/admin/clients/client-info-component/client-info-component.component';
import { ClientsServiceService } from '../../../../services/admin/clients/clients-service.service';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-component',
  templateUrl: './client-component.component.html',
  styleUrls: ['./client-component.component.css']
})
export class ClientComponentComponent implements OnInit, AfterViewInit {

  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   //ordenacion
   @ViewChild(MatSort, { static: false }) sort: MatSort;

   //columnas de la tabla
  displayedColumns: string[] = ['nombre', 'apellidos', 'email', 'dni', 'telefono', 'info'];

  data: UserClient[] = [];

  //filtros
  filters = new FormGroup({
    name: new FormControl(''),
    subname: new FormControl(''),
    email: new FormControl(''),
    dni: new  FormControl(''),
    phone: new FormControl('')
  });

  //propiedades de la tabla
  resultsLength = 0;
  loadingData = true;
  errorLoadingData = false;
  //promesa de la busqueda
  observer = null;
  res: string;

  constructor(public dialog: MatDialog, private clientsSrv: ClientsServiceService,private toastr: ToastrService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {

    // suscribe al cambio de orden --> mostramos la primera pagina
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    //cargamos datos al entrar
    debugger;
    this.getDatos(this.getParams());
  }

  //devuelve objeto con los valores de los filtros
  private getParams() {
    let params = {
      name: this.filters.value.name,
      subname: this.filters.value.subname,
      phone: this.filters.value.phone,
      email: this.filters.value.email,
      dni: this.filters.value.dni
    };
    return params;
  };

  //rellena la tabla
  getDatos(params) {
    debugger;
    this.observer = merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.loadingData = true;
        return this.clientsSrv!.getClients(
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
    this.clientsSrv.getUsersExcel(
      this.sort.active,
      this.sort.direction,
      this.getParams()
    ).subscribe(this.downloadFile);
  }

  downloadFile(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `usuarios.xlsx`);
  }

  onRemoveClient(num) {
    this.openDialogRemoveClient(num);
  }


  onInfoClick(row) {
    this.openDialogInfo(row);

  }

  //abre la ventana de borrado de clientes
  openDialogInfo(num): void {
    let position: DialogPosition = {};
    position.top="85px";
    var data = Object.assign({},num) ;
    const dialogRef = this.dialog.open(ClientInfoComponentComponent, {
      width: '800px',
      height: '550px',
      disableClose:true,
      position: position,
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        this.toastr.success("El cliente seleccionado se ha borrado correctamente.", "", {
          timeOut: 2000
        });
      } else if (result == "ko") {
        this.toastr.error("No se ha podido borrar el cliente seleccionado", "", {
          timeOut: 2000
        });
      }
    });
  }


  //abre la ventana de borrado de clientes
  openDialogRemoveClient(num): void {
    let position: DialogPosition = {};
    position.top="85px";
    const dialogRef = this.dialog.open(RemoveClientComponentComponent, {
      width: '600px',
      height: '200px',
      disableClose:true,
      position: position,
      data: num
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        this.toastr.success("El cliente seleccionado se ha borrado correctamente.", "", {
          timeOut: 2000
        });
        this.onRefresh();
      } else if (result == "ko") {
        this.toastr.error("No se ha podido borrar el cliente seleccionado", "", {
          timeOut: 2000
        });
      }
    });
  }

}

