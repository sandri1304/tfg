import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { UserClientArray, UserClient } from 'src/app/dataModels/userclient';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app/dataModels/Response';

@Injectable({
  providedIn: 'root'
})
export class ClientsServiceService {

  constructor(private http: HttpClient) { }

  /*getclients(): Observable<HttpResponse<ClientsResponse>> {
    return this.http.get<ClientsResponse>(Properties.nevado_client_base_context + Properties.nevado_client_admin_context + "/clients", {observe: 'response'})
    .pipe(catchError(this.handleError));
  }*/

  getClients(sort: string, order: string, page: number, pageSize: number, params): Observable<UserClientArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/clients?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.name) requestUrl += `&name=${params.name}`;
    if (params.subname) requestUrl += `&subname=${params.subname}`;
    if (params.dni) requestUrl += `&dni=${params.dni}`;
    if (params.phone) requestUrl += `&phone=${params.phone}`;
    if (params.email) requestUrl += `&email=${params.email}`;

    return this.http.get<UserClientArray>(requestUrl);
  }

  getUsersExcel(sort: string, order: string, params) {

    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/clients/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.name) requestUrl += `&name=${params.name}`;
    if (params.subname) requestUrl += `&subname=${params.subname}`;
    if (params.dni) requestUrl += `&dni=${params.dni}`;
    if (params.phone) requestUrl += `&phone=${params.phone}`;
    if (params.email) requestUrl += `&email=${params.email}`;

    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  removeClient(idUser: string, idClient: string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/clients/${idUser}?`;

    if (idClient) requestUrl += `&idClient=${idClient}`;

    return this.http.delete<Response>(requestUrl,{observe: 'response'})
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
