import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { CategoriesArray, Categories } from 'src/app/dataModels/interfacesCategories';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app//dataModels/Response';
import { UrlResolver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CategoriesServiceService {

  constructor(private http: HttpClient) { }


  getCategoriesProducts(): Observable<Categories[]> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/categories/Products';
    return this.http.get<Categories[]>(requestUrl);
  }

  getCategories(sort: string, order: string, page: number, pageSize: number, params): Observable<CategoriesArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/categories?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.nombre) requestUrl += `&name=${params.nombre}`;

    return this.http.get<CategoriesArray>(requestUrl);
  }

  getCategoriesExcel(sort: string, order: string, params) {

    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/categories/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.nombre) requestUrl += `&name=${params.nombre}`;
    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  removeCategory(id: string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/categories/${id}`;
    return this.http.delete<Response>(requestUrl,{observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  saveCategory(category): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/categories`;
    return this.http.post<Response>(requestUrl, category, {observe: 'response'})
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
