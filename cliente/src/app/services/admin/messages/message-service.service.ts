import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { MessagesArray, Messages } from 'src/app/dataModels/interfacesMessages';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app/dataModels/Response';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  constructor(private http: HttpClient) { }

  getMessages(sort: string, order: string, page: number, pageSize: number, params): Observable<MessagesArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/messages?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.name) requestUrl += `&name=${params.name}`;
    if (params.email) requestUrl += `&email=${params.email}`;
    if (params.fecha) requestUrl += `&date=${params.fecha}`;
    if (params.read) requestUrl += `&read=${params.read}`;

    return this.http.get<MessagesArray>(requestUrl);
  }

  getMessagesExcel(sort: string, order: string, params) {

    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/messages/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.name) requestUrl += `&name=${params.name}`;
    if (params.email) requestUrl += `&email=${params.email}`;
    if (params.fecha) requestUrl += `&date=${params.fecha}`;
    if (params.read) requestUrl += `&read=${params.read}`;

    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  removeMessage(idMessage: string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/messages/${idMessage}?`;
    return this.http.delete<Response>(requestUrl,{observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  updateMessage(idMessage: string, checked): Observable<HttpResponse<Response>> {
    let message  = checked;
    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/messages/${idMessage}?`;
    return this.http.post<Response>(requestUrl, message, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  sendAnswer(answer): Observable<HttpResponse<Response>> {
    console.log(answer);
    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/messages/send`;
    return this.http.post<Response>(requestUrl, answer, {observe: 'response'})
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
