import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ImportdataService {

  constructor(private http: HttpClient) { }



  getTemplate(template) {
    let requestUrl = 'http://localhost:4200/nevado/admin/import/template?template=' + template;
    return this.http.get(requestUrl, { responseType: 'blob' });
  }

  uploadImport(formData) {
    let requestUrl = 'http://localhost:4200/nevado/admin/import/upload';
    return this.http.post(requestUrl, formData);
  }

  getImportLog(fileId) {
    let requestUrl = 'http://localhost:4200/nevado/admin/import/getImportData?file=' + fileId;
    return this.http.get(requestUrl);
  }

}
