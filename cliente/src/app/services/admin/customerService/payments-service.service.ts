import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { PaymentsArray, Payments } from 'src/app/dataModels/interfacesPayments';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app//dataModels/Response';


@Injectable({
  providedIn: 'root'
})
export class PaymentsServiceService {

  constructor(private http: HttpClient) { }

  getPayments(sort: string, order: string, page: number, pageSize: number, params): Observable<PaymentsArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/payments?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.nombre) requestUrl += `&name=${params.nombre}`;

    return this.http.get<PaymentsArray>(requestUrl);
  }

  getPaymentsExcel(sort: string, order: string, params) {

    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/payments/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.nombre) requestUrl += `&name=${params.nombre}`;
    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  removePayment(id: string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/payments/${id}`;
    return this.http.delete<Response>(requestUrl,{observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  savePayment(payment): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/payments`;
    return this.http.post<Response>(requestUrl, payment, {observe: 'response'})
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
