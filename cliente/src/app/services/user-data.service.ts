import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { catchError} from 'rxjs/operators';

import { UserProfile } from '../dataModels/userProfile';
import { Response } from '../dataModels/Response';
import { RegisterIdUserComponent } from '../components/header/register/register-id-user/register-id-user.component';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) {

  }

  getUserProfile(userId: String): Observable<HttpResponse<UserProfile>> {
    return this.http.get<UserProfile>("/nevado/user/" + userId , {observe: 'response'})
    .pipe(catchError(this.handleError));
  }

  updateUserProfile(userProfile: UserProfile): Observable<HttpResponse<Response>> {
    return this.http.post<Response>("/nevado/user/" + userProfile.idUser, userProfile, {observe: 'response'})
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
