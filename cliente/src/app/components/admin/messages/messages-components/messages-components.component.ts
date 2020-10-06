import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { MessageServiceService } from '../../../../services/admin/messages/message-service.service';
import { RemoveMessageComponentComponent } from  '../remove-message-component/remove-message-component.component';
import { MessageInfoComponentComponent } from '../message-info-component/message-info-component.component';

@Component({
  selector: 'app-messages-components',
  templateUrl: './messages-components.component.html',
  styleUrls: ['./messages-components.component.css']
})


export class MessagesComponentsComponent implements OnInit, AfterViewInit {

  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   //ordenacion
   @ViewChild(MatSort, { static: false }) sort: MatSort;

  //columnas de la tabla
  displayedColumns: string[] = ['name', 'email', 'date', 'message', 'read', 'info'];

  data = [];

  //filtros
  filters = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    fecha: new FormControl(''),
    read: new  FormControl('')
  });

  //propiedades de la tabla
  resultsLength = 0;
  loadingData = true;
  errorLoadingData = false;
  //promesa de la busqueda
  observer = null;
  res: string;

  constructor(public dialog: MatDialog,
              private messageSrv: MessageServiceService,
              private toastr: ToastrService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    // suscribe al cambio de orden --> mostramos la primera pagina
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    //cargamos datos al entrar
    this.getDatos(this.getParams());
  }

  //devuelve objeto con los valores de los filtros
  private getParams() {
    let params = {
      name: this.filters.value.name,
      email: this.filters.value.email,
      fecha: this.filters.value.fecha,
      read: this.filters.value.read
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
          return this.messageSrv!.getMessages(
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
    this.messageSrv.getMessagesExcel(
      this.sort.active,
      this.sort.direction,
      this.getParams()
    ).subscribe(this.downloadFile);
  }

  downloadFile(data: any) {
    // npm install file-saver --save
    // npm install @types/file-saver --save
    saveAs(data, `mensajes.xlsx`);
  }

  onRemoveMessage(num) {
    this.openDialogRemoveMessage(num);
  }

  //abre la ventana de borrado de clientes
  openDialogRemoveMessage(num): void {
    let position: DialogPosition = {};
    position.top="85px";
    const dialogRef = this.dialog.open(RemoveMessageComponentComponent, {
      width: '600px',
      height: '200px',
      disableClose:true,
      position: position,
      data: num
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        this.toastr.success("El mensaje seleccionado se ha borrado correctamente.", "", {
          timeOut: 2000
        });
        this.onRefresh();
      } else if (result == "ko") {
        this.toastr.error("No se ha podido borrar el mensaje seleccionado", "", {
          timeOut: 2000
        });
      }
    });
  }

  onInfoClick(row) {
    this.openDialogInfo(row);

  }

  openDialogInfo(num): void {
    console.log(num);
    let position: DialogPosition = {};
    position.top="85px";
    var data = Object.assign({},num) ;
    const dialogRef = this.dialog.open(MessageInfoComponentComponent, {
      width: '800px',
      height: '550px',
      disableClose:true,
      position: position,
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        let messageRes = "Se ha envíado una respuesta al usuario " + num.correoUsuario;  
          this.toastr.success(messageRes, "",{
          timeOut: 3000
        });
      } else if (result == "ko") {
        this.toastr.error("No se ha podido borrar el cliente seleccionado", "", {
          timeOut: 2000
        });
      }
    });
  }

}
