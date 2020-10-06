import { OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';
import { OrdersServiceService } from '../../../../../services/admin/orders/orders-service.service';
import { Products } from '../../../catalogue/interfacesProducts';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-orders-info',
  templateUrl: './orders-info.component.html',
  styleUrls: ['./orders-info.component.css']
})
export class OrdersInfoComponent implements AfterViewInit {

  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;


  //columnas de la tabla
  displayedColumns: string[] = ['codigoArticulo', 'categoria', 'marca', 'modelo', 'cantidad'];
  //datos de la tabla
  dataProducts: Products[] = [];

  //propiedades de la tabla
  loadingData = true;
  errorLoadingData = false;
  errorUpdateOrder = false;
  errorFormat = {};
  status = "";
  cantidad =[];
  cobrado;

  //propiedades de la tabla
  resultsLength = 0;

  //promesa de la busqueda
  observer = null;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrdersInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dOrdersSrv: OrdersServiceService,
    private clientFormBuilder: FormBuilder ) {
  }

  order = new FormGroup({
    idPedido:  new FormControl(''),
    estado:  new FormControl(''),
    fechaEntrada:  new FormControl(''),
    fechaEntrega:  new FormControl(''),
    usuarios:  new FormControl(''),
    cobrado:  new FormControl(''),
  });

  estados = [{nombre: "Entregado"},
             {nombre:"Preparando"},
             {nombre:"Finalizado"},
             {nombre:"Pendiente envio"},
             {nombre:"Pendiente recoger"}];

  ngAfterViewInit() {
    let usuarios = this.data.usuarios;
    delete this.data.usuarios;
    this.cobrado = this.data.cobrado;

    this.status = this.data.estado;
    let orders = this.data;
    let fechaEntrada = new Date(this.data.fechaEntrada);
    let dateentrada = (fechaEntrada.getDate().toString().length == 1) ? "0" + fechaEntrada.getDate() : fechaEntrada.getDate();
    let monthEntrada = ((fechaEntrada.getMonth() + 1).toString().length == 1) ? "0" + (fechaEntrada.getMonth() + 1) :  fechaEntrada.getMonth() + 1;
    let fechaEntradaP =  dateentrada + "/" + monthEntrada + "/" + fechaEntrada.getFullYear();
    let fechaEntrega = new Date(this.data.fechaEntrega);
    let dateentrega = (fechaEntrega.getDate().toString().length == 1) ? "0" + fechaEntrega.getDate() : fechaEntrega.getDate();
    let monthEntrega = ((fechaEntrega.getMonth() + 1).toString().length == 1) ? "0" + (fechaEntrega.getMonth() + 1) :  fechaEntrega.getMonth() + 1;
    let fechaEntregaP =  dateentrega + "/" + monthEntrega + "/" + fechaEntrega.getFullYear();
    orders.fechaEntrada = fechaEntradaP;
    orders.fechaEntrega = fechaEntregaP;
    orders.usuarios = usuarios.correo;
    orders.cobrado = this.data.cobrado;
    this.order = this.clientFormBuilder.group(orders);

    // suscribe al cambio de orden --> mostramos la primera pagina
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    this.data.articulos.map(i => this.cantidad[i.articulo._id] = i.cantidad);

    this.getDatos(this.getParams());

  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
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

    data.map(i => i.cantidad = this.cantidad[i._id]);
    this.dataProducts = data
  }

  private getParams() {
    let params = this.data.articulos.map(i => i.articulo._id);
    return params.toString();
  }

  updateOrder() {
    let statusName = this.estados.map(i => i.nombre);
    let positionPrevious = statusName.indexOf(this.status);
    let positionUpdate = statusName.indexOf(this.order.value.estado);

    if ((positionPrevious == 0 && positionUpdate == 1) || (positionPrevious == 1 && positionUpdate == 2) || (positionPrevious == 3 && positionUpdate == 0) || (positionPrevious == 4 && positionUpdate == 0)
        ||  (positionPrevious == 3 && positionUpdate == 1) || (positionPrevious == 4 && positionUpdate == 1) || (positionPrevious == 2 && positionUpdate == 0) || (positionPrevious == 3 && positionUpdate == 2) || (positionPrevious == 4 && positionUpdate == 2)) {
      let updateStatus = {
        idPedido: this.order.value.idPedido,
        estado: this.order.value.estado,
        fechaEntrada: new Date(this.order.value.fechaEntrada),
        fechaEntrega: new Date(this.order.value.fechaEntrega),
      };

      let orders = this;
      if (this.data._id != null) {
        this.dOrdersSrv.updateOrderById(this.data._id, updateStatus).subscribe(function(response){
          if (response.body.code == 200) {
            orders.closeDialog("ok");
          } else {
            orders.closeDialog("koU");
          }
        });
      };
    } 

    if(this.cobrado != this.order.value.cobrado) {
      let orders = this;
      let updateOrder = {
        cobrado: this.order.value.cobrado
      }
      this.dOrdersSrv.updateOrderCobradoById(this.data._id, updateOrder).subscribe(function(response){
        if (response.body.code == 200) {
          orders.closeDialog("ok");
        } else {
          orders.closeDialog("koU");
        }
      });
    } else {
      this.closeDialog("ko");
    };







  }

}
