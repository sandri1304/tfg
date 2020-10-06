import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app/dataModels/Response';
import { Orders, OrdersArray } from 'src/app/dataModels/interfacesOrders';

@Injectable({
  providedIn: 'root'
})
export class FrontServiceService {

  constructor(private http: HttpClient) { }

  getProductData(url: string) {
    return this.http.get(url);
  }

  getProductDataByCategory(url: string, category: string) {
    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context +  '/' + url + '?';
    if (category != null && category != "") requestUrl += `name=${category}`;
    return this.http.get(requestUrl);
  }

  getCategoriesData(title: string, url:string) {
    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context +  '/' + url + '?';
    if (title != null && title != "") requestUrl += `name=${title}`;
    return this.http.get(requestUrl);
  }

  getBrand(url:string, brand:string) {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context +'/' + url +  '?';
    if (brand != null && brand != "")
      requestUrl += `name=${brand}`;
    return this.http.get(requestUrl);
  }

  addReview(review, id:string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + '/front/review?';
    if (id != null && id != "")
      requestUrl += `idProduct=${id}`;
    return this.http.post<Response>(requestUrl, review, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  getBrands(url: string) {
    return this.http.get(url);
  }

  getPaymentsMethod() {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + '/front/paymentMethods';
    return this.http.get(requestUrl);
  }

  saveOrder(order) {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + '/front/saveOrder';
    return this.http.post<Response>(requestUrl, order, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  getOrders(sort: string, order: string, page: number, pageSize: number, params, idUser): Observable<OrdersArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + '/orders/'+ `${idUser}` + '?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.idOrders) requestUrl += `&idOrders=${params.idOrders}`;
    if (params.status) requestUrl += `&status=${params.status}`;
    if (params.entryDate) requestUrl += `&entryDate=${params.entryDate}`;

    return this.http.get<OrdersArray>(requestUrl);
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
