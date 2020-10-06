import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { BrandsArray, Brands } from 'src/app/dataModels/interfacesBrands';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app//dataModels/Response';
import { UrlResolver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class BrandsServiceService {

  constructor(private http: HttpClient) { }

  getBrandsProducts(): Observable<Brands[]> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/brands/Products';
    return this.http.get<Brands[]>(requestUrl);
  }

  getBrands(sort: string, order: string, page: number, pageSize: number, params): Observable<BrandsArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/brands?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.nombre) requestUrl += `&name=${params.nombre}`;

    return this.http.get<BrandsArray>(requestUrl);
  }

  getBrandsExcel(sort: string, order: string, params) {

    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/brands/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.nombre) requestUrl += `&name=${params.nombre}`;
    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  removeBrand(id: string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/brands/${id}`;
    return this.http.delete<Response>(requestUrl,{observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  saveBrand(brand): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/brands`;
    return this.http.post<Response>(requestUrl, brand, {observe: 'response'})
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
