import { OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , DialogPosition} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';

import { Products } from 'src/app/components/admin/catalogue/interfacesProducts';
import { Properties } from 'src/app/dataModels/properties';
import { ToastrService } from 'ngx-toastr';
import { MessageServiceService } from '../../../../services/admin/messages/message-service.service';


@Component({
  selector: 'app-message-info-component',
  templateUrl: './message-info-component.component.html',
  styleUrls: ['./message-info-component.component.css']
})
export class MessageInfoComponentComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  loadingData = false;
  errorLoadingData = false;
  errorSaveProdcut = false;
  errorUpdateProduct = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MessageInfoComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dMessageSrv: MessageServiceService,
    private messageFormBuilder: FormBuilder,
    private toast : ToastrService
  ) {

 
   }


   message = new FormGroup({
    nombreUsuario:  new FormControl(''),
    correoUsuario:  new FormControl(''),
    fecha:  new FormControl(''),
    leido:  new FormControl(''),
    mensaje:  new FormControl(''),
    respuesta:  new FormControl('')
  });
  ngOnInit() {
    
    let fecha = new Date(this.data.fecha);
    let date = (fecha.getDate().toString().length == 1) ? "0" + fecha.getDate() : fecha.getDate();
    let month = ((fecha.getMonth() + 1).toString().length == 1) ? "0" + (fecha.getMonth() + 1) :  fecha.getMonth() + 1;
    let fechaFormat =  date + "/" + month + "/" + fecha.getFullYear();
    this.data.fecha = fechaFormat;
    this.data.respuesta = "";
    this.message = this.messageFormBuilder.group(this.data);
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  updateMessage(event) {
    console.log(this.data);
    this.data.leido = event.checked;
    let me =  this;
    this.dMessageSrv.updateMessage(this.data._id, this.data).subscribe(function(res){
      if (res.body.code == 200) {
        me.toast.success("Se ha actualizado el mensaje", "", {
          timeOut: 3000
        });
      } else {
        me.toast.error("Se ha producido un error al marcar el campo Leído", "", {
          timeOut: 3000
        });
      }
    })
  }

  sendResponse() {
    let answer = {
      answerSend: this.message.value.respuesta
    }
    let me  = this;
    this.dMessageSrv.sendAnswer(answer).subscribe(function(res){
      if(res.body.code == 200) {
        
        me.dialogRef.close("ok");
      }
    })
  }
}
