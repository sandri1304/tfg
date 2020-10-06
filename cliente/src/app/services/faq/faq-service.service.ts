import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Response } from 'src/app/dataModels/Response';
import { merge, Observable, of as observableOf } from 'rxjs';
import { Properties } from 'src/app/dataModels/properties';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FaqServiceService {

  constructor(private http: HttpClient) { }

  saveMessage(message) : Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + '/front/message';
    return this.http.post<Response>(requestUrl, message, {observe: 'response'})

  }
}
