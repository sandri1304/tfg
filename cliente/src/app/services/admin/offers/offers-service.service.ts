import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { OffersArray, Offers } from 'src/app/dataModels/interfacesOffers';
import { Properties } from 'src/app/dataModels/properties';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Response } from 'src/app//dataModels/Response';
import { UrlResolver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class OffersServiceService {

  constructor(private http: HttpClient) { }

  getOffers(sort: string, order: string, page: number, pageSize: number, params): Observable<OffersArray> {

    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/offers?';

    if (page >= 0) requestUrl += `page=${page + 1}`;
    if (pageSize > 0) requestUrl += `&pageSize=${pageSize}`;
    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.idOffer) requestUrl += `&idOffer=${params.idOffer}`;
    if (params.discount) requestUrl += `&discount=${params.discount}`;
    if (params.initDate) requestUrl += `&initDate=${params.initDate}`;
    if (params.endDate) requestUrl += `&endDate=${params.endDate}`;

    return this.http.get<OffersArray>(requestUrl);
  }

  getOffersExcel(sort: string, order: string, params) {

    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/offers/export?';

    if (sort) requestUrl += `&sort=${sort}`;
    if (order) requestUrl += `&order=${order}`;
    if (params.idOffer) requestUrl += `&idOffer=${params.idOffer}`;
    if (params.discount) requestUrl += `&discount=${params.discount}`;
    if (params.initDate) requestUrl += `&initDate=${params.initDate}`;
    if (params.endDate) requestUrl += `&endDate=${params.endDate}`;
    return this.http.get(requestUrl,{ responseType: 'blob' });
  }

  removeOffer(id: string): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/offers/${id}`;
    return this.http.delete<Response>(requestUrl,{observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  saveOffer(offer: Offers): Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/offers`;
    return this.http.post<Response>(requestUrl, offer, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  updateOffer(id:string, offer: Offers):  Observable<HttpResponse<Response>> {
    let requestUrl = Properties.nevado_client_localhost +  Properties.nevado_client_base_context + Properties.nevado_client_admin_context + `/offers/${id}`;
    return this.http.post<Response>(requestUrl, offer, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  getOffersProducts(): Observable<Offers[] > {
    let requestUrl = Properties.nevado_client_localhost + Properties.nevado_client_base_context + Properties.nevado_client_admin_context + '/offers/Products';
    return this.http.get<Offers[]>(requestUrl);
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
