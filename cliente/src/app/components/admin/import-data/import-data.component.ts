import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ImportdataService } from '../../../services/admin/importdata/importdata.service'
import { timer } from 'rxjs';


@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.css']
})
export class ImportDataComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private importData: ImportdataService
  ) { }

  @ViewChild("fichero", { static: false }) fichero: ElementRef;

  form = new FormGroup({
    import: new FormControl(''),
    file: new FormControl('')
  });

  currentImport = null;
  currentType = null;
  logTimer;
  logData = [];

  ngOnInit() {
  }

  plantilla() {
    if (this.form.value.import == null || this.form.value.import == "") {
      this.toastr.error("Selecciona un tipo de importacion", "", {
        timeOut: 2000
      });
      return;
    }
    let me = this;
    this.importData.getTemplate(this.form.value.import)
      .subscribe(function (data) {
        saveAs(data, me.form.value.import + `.xlsx`);
      });
  }



  importar() {
    this.currentImport = null;
    this.currentType = null;

    if (this.form.value.import == null || this.form.value.import == "") {
      this.toastr.error("Selecciona un tipo de importacion", "", {
        timeOut: 2000
      });
      return;
    }

    if (this.fichero.nativeElement.files.length == 0) {
      this.toastr.error("Selecciona un fichero", "", { timeOut: 2000 });
      return;
    }
    if (this.fichero.nativeElement.files.length > 1) {
      this.toastr.error("Solo se permite un fichero", "", { timeOut: 2000 });
      return;
    }
    if (!this.fichero.nativeElement.files[0].name.endsWith('.xls')
      && !this.fichero.nativeElement.files[0].name.endsWith('.xlsx')
      && !this.fichero.nativeElement.files[0].name.endsWith('.zip')) {
      this.toastr.error("El fichero no es un excel", "", { timeOut: 2000 });
      return;
    }

    let me = this;
    let type = me.form.value.import;
    let file = me.fichero.nativeElement.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    this.importData.uploadImport(formData).subscribe(res => {
      me.logImport(res, type);
    })

  }

  logImport(res, type) {
    this.currentImport = res.import;
    this.currentType = type;

    this.logTimer = timer(0, 3000).subscribe(val => {
      this.importData.getImportLog(res.import).subscribe(log => { this.showLog(log) });
    });
  }

  showLog(log) {
    if (log.error) {
      this.stopLog();
      return;
    }
    if (log.error || log.status == "finished") {
      this.stopLog();
    }
    this.logData = log.log;
  }

  stopLog() {
    if (this.logTimer != null) {
      this.logTimer.unsubscribe();
    }
  }
}
