import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { Invoices, ArrayInvoices } from 'src/app/dataModels/interfacesInvoices';
import { Properties } from 'src/app/dataModels/properties';
import { ProductsArray} from 'src/app/components/admin/catalogue/interfacesProducts';

@Injectable({
  providedIn: 'root'
})
export class InvoicesServiceService {

  constructor(private http: HttpClient) { }

  getInvoices(sort: string, order: string, page: number, pageSize: number, params): Observable<ArrayInvoices> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/invoices?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.cliente) requestUrl += `&client=${params.cliente}`;
    if (params.fecha) requestUrl += `&date=${params.fecha}`;
    if (params.nFactura) requestUrl += `&nInvoice=${params.nFactura}`;

    return this.http.get<ArrayInvoices>(requestUrl);
  }

  getInvoicesExcel(sort: string, order: string, params) {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/invoices/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.cliente) requestUrl += `&client=${params.cliente}`;
    if (params.fecha) requestUrl += `&date=${params.fecha}`;
    if (params.nFactura) requestUrl += `&nInvoice=${params.nFactura}`;

    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  getInvoiceById(id: string){
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/invoices/${id}`;
    return this.http.get(requestUrl);
  }

  getInvoicesProducts(sort:string, order: string, page: number, pageSize: number, params): Observable<ProductsArray> {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/invoices/products?';
    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params != null) requestUrl += `&ids=${params}`;

    return this.http.get<ProductsArray>(requestUrl);

  }

  getClient(id:string) {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/invoices/client?' + `idUser='${id}`;
    return this.http.get(requestUrl);
  }


  addInvoice(row): Observable<HttpResponse<Response>> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/invoices/pedido?' + `idPedido='${row.idPedido}`; 
    return this.http.post<Response>(requestUrl, row, {observe: 'response'})
  }

  pdfCreatorInvoice(data): Observable<HttpResponse<Response>> {
    console.log(data);
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/invoices/pdf?' + `idInvoice='${data._id}`; 
    return this.http.post<Response>(requestUrl, data, {observe: 'response'})
  }
}
