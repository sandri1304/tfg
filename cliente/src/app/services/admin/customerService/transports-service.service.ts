import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { TransportsArray, Transports } from 'src/app/dataModels/interfacesTransports';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app//dataModels/Response';

@Injectable({
  providedIn: 'root'
})
export class TransportsServiceService {

  constructor(private http: HttpClient) { }

  getTransports(sort: string, order: string, page: number, pageSize: number, params): Observable<TransportsArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/transports?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.nombre) requestUrl += `&name=${params.nombre}`;

    return this.http.get<TransportsArray>(requestUrl);
  }

  getTransportsExcel(sort: string, order: string, params) {

    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/transports/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.nombre) requestUrl += `&name=${params.nombre}`;
    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  removeTransport(id: string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/transports/${id}`;
    return this.http.delete<Response>(requestUrl,{observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  saveTransport(transport: Transports): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/transports`;
    return this.http.post<Response>(requestUrl, transport, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  private handleError(error:HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("Un error ha ocurrido", error.error.message);
      return throwError (error.error.message);
    } else {
      console.error(`Error devuelto por el servidor ${error.status}, ${error.error}`);
      return throwError (error.error);
    }
  }
}
