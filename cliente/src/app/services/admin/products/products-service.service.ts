import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { ProductsArray, Products } from 'src/app/components/admin/catalogue/interfacesProducts';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app/dataModels/Response';

@Injectable({
  providedIn: 'root'
})
export class ProductsServiceService {

  constructor(private http: HttpClient) { }


  getProducts(sort: string, order: string, page: number, pageSize: number, params): Observable<ProductsArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/products?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.categoria) requestUrl += `&category=${params.categoria}`;
    if (params.marca) requestUrl += `&brand=${params.marca}`;
    if (params.codigoArticulo) requestUrl += `&codeProduct=${params.codigoArticulo}`;
    if (params.pvp) requestUrl += `&price=${params.pvp}`;

    return this.http.get<ProductsArray>(requestUrl);
  }

  getProductsExcel(sort: string, order: string, params) {

    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/products/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.categoria) requestUrl += `&category=${params.categoria}`;
    if (params.marca) requestUrl += `&brand=${params.marca}`;
    if (params.codigoArticulo) requestUrl += `&codeProduct=${params.codigoArticulo}`;
    if (params.pvp) requestUrl += `&price=${params.pvp}`;

    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  getProductsById(id: string){
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/products/${id}`;
    return this.http.get(requestUrl);
  }

  updateProductById(id: string, product): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/products/${id}`;
    return this.http.post<Response>(requestUrl, product, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  saveProduct(product): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/products`;
    return this.http.post<Response>(requestUrl, product, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  removeProduct(id: string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/products/${id}`;
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
