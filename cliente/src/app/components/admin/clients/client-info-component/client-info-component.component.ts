import { OnInit, ViewChild  } from '@angular/core';
import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';

import { Products } from 'src/app/components/admin/catalogue/interfacesProducts';
import { ClientsServiceService } from 'src/app/services/admin/clients/clients-service.service';

@Component({
  selector: 'app-client-info-component',
  templateUrl: './client-info-component.component.html',
  styleUrls: ['./client-info-component.component.css']
})
export class ClientInfoComponentComponent implements OnInit {

  // infoClientForm;
  // infoClient;
  //ordenacion
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  messageError: string;
  errorFormat: {};

  //propiedades de la tabla
  loadingData = false;
  errorLoadingData = false;
  errorSaveProdcut = false;
  errorUpdateProduct = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ClientInfoComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dClientsSrv: ClientsServiceService,
    private clientFormBuilder: FormBuilder ) {
  }

  client = new FormGroup({
    correo:  new FormControl(''),
    nombre:  new FormControl(''),
    apellidos:  new FormControl(''),
    dni:  new FormControl(''),
    telefono:  new FormControl(''),
    fechaNacimiento:  new FormControl(''),
    direccionFactura:  new FormControl(''),
    direccionEnvio:  new FormControl(''),
    pedidos:  new FormControl(''),
  });

  ngOnInit() {
    debugger;
    let userClient = this.data.clientes;
    delete this.data.clientes;
    let user = {...this.data,...userClient};
    let fecha = new Date(user.fechaNacimiento);
    let date = (fecha.getDate().toString().length == 1) ? "0" + fecha.getDate() : fecha.getDate();
    let month = ((fecha.getMonth() + 1).toString().length == 1) ? "0" + (fecha.getMonth() + 1) :  fecha.getMonth() + 1;
    let fechaNacimiento =  date + "/" + month + "/" + fecha.getFullYear();

    user.fechaNacimiento = fechaNacimiento;

    let shippingAddress = user.direccionEnvio + ", " + user.codigoPostalEnvio + " " + user.puebloEnvio + ", " + user.provinciaEnvio;
    let billingAddress = user.direccionFactura + ", " + user.codigoPostalFactura + " " + user.puebloFactura + ", " + user.provinciaFactura;
    user.direccionEnvio = shippingAddress;
    user.direccionFactura = billingAddress;

    this.client = this.clientFormBuilder.group(user);
  };

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }
};

