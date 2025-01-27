import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiUsuariosService {
  crud: CRUD;

  entity = 'users';

  constructor(private crudService: CrudService, private http: CustomHttpService, private authService: AuthService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  emailValidation(emailValidationToken: string, uidb64: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/email_validation`, {
      token: emailValidationToken,
      uidb64,
    });
  }

  sendEmailValidation(uidb64: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/send_email_validation`, {
      uidb64,
    });
  }

  sendEmailValidationByEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/send_email_validation`, {
      email,
    });
  }

  login(data: any, loading = false): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/${this.entity}/login`, data, undefined, loading)
      .pipe(tap((response) => this.authService.handleLoginResponse(response)));
  }

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/${this.entity}/login_with_google`, {
        id_token: idToken,
      })
      .pipe(tap((response) => this.authService.handleLoginResponse(response)));
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/reset_password`, data);
  }

  sendResetPasswordEmail(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/send_reset_password_email`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/change_password`, data);
  }

  getUser(loading = true): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/get_user`, undefined, undefined, loading);
  }

  status(): Observable<any> {
    return of({status_name: 'UNDEFINED'});
  }
}
