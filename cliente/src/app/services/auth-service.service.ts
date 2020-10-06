import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { catchError} from 'rxjs/operators';

import { Properties } from '../dataModels/properties';
import { Users } from '../dataModels/users';
import { Response } from '../dataModels/response';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {



  constructor(private http: HttpClient) {
  }

  getRegister(user:Users): Observable<HttpResponse<Response>> {
    return this.http.post<Response>(Properties.nevado_client_base_context + Properties.nevado_client_auth_context + "/register", user, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  getLogin(user: Users): Observable<HttpResponse<Users>> {
    return this.http.post<Users>(Properties.nevado_client_base_context + Properties.nevado_client_auth_context + "/login", user, {observe: 'response'})
    .pipe(catchError(this.handleError));
  };

  getLogout():Observable<HttpResponse<Response>> {
    return this.http.get<Response>(Properties.nevado_client_base_context + Properties.nevado_client_auth_context + "/logout", {observe: 'response'}) .pipe(catchError(this.handleError));

  }

  getRegisterIdUser(userId: String): Observable<HttpResponse<Response>> {
    return this.http.post<Response>(Properties.nevado_client_base_context + Properties.nevado_client_auth_context + "/register/" + userId , null, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  updatePassword(email: String): Observable<HttpResponse<Response>> {
  return this.http.get<Response>(Properties.nevado_client_base_context + Properties.nevado_client_auth_context + "/forgetPassword/" + email, {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  updatePassword2(user: Users): Observable<HttpResponse<Response>> {
    return this.http.post<Response>(Properties.nevado_client_base_context + Properties.nevado_client_auth_context + "/forgetPassword/" + user.username , user, {observe: 'response'})
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
