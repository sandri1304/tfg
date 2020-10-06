import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { Orders, OrdersArray } from 'src/app/dataModels/interfacesOrders';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app//dataModels/Response';
import { ProductsArray} from 'src/app/components/admin/catalogue/interfacesProducts';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrdersServiceService {

  private countOrdersSubject = new Subject<number>();
  public countOrdersObs$ = this.countOrdersSubject.asObservable();

  constructor(private http: HttpClient) { }

  getOrders(sort: string, order: string, page: number, pageSize: number, params): Observable<OrdersArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/orders?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.idOrders) requestUrl += `&idOrders=${params.idOrders}`;
    if (params.status) requestUrl += `&status=${params.status}`;
    if (params.entryDate) requestUrl += `&entryDate=${params.entryDate}`;
    if (params.email) requestUrl += `&email=${params.email}`;

    return this.http.get<OrdersArray>(requestUrl);
  }

  getOrdersExcel(sort: string, order: string, params) {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/orders/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.idOrders) requestUrl += `&idOrders=${params.idOrders}`;
    if (params.status) requestUrl += `&status=${params.status}`;
    if (params.entryDate) requestUrl += `&entryDate=${params.entryDate}`;
    if (params.email) requestUrl += `&email=${params.email}`;

    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  getOrdersProducts(sort:string, order: string, page: number, pageSize: number, params): Observable<ProductsArray> {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/orders/products?';
    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params != null) requestUrl += `&ids=${params}`;

    return this.http.get<ProductsArray>(requestUrl);

  }

  updateOrderById(id: string, estado): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/orders/${id}`;
    return this.http.post<Response>(requestUrl, estado, {observe: 'response'})
  }

  updateOrderCobradoById(id: string, cobrado): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/orders/cobrado/${id}`;
    return this.http.post<Response>(requestUrl, cobrado, {observe: 'response'})
  }

  getOrderPending() {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/orders/pending?';
    return this.http.get(requestUrl,{ responseType: 'text' });

  }

  setCountOrdersSubject(count){
    this.countOrdersSubject.next(count);
  }
}
