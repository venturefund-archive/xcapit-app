import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config/app-constants.config';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiUsuariosService {
  crud: CRUD;

  entity = 'users';

  constructor(
    private crudService: CrudService,
    private http: CustomHttpService,
    private authService: AuthService
  ) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  emailValidation(emailValidationToken: string, uidb64: string): Observable<any> {
    return this.http.post(`${API_URL}/${this.entity}/email_validation`, {
      token: emailValidationToken,
      uidb64
    });
  }

  sendEmailValidation(uidb64: string): Observable<any> {
    return this.http.post(`${API_URL}/${this.entity}/send_email_validation`, {
      uidb64
    });
  }

  login(data: any): Observable<any> {
    return this.http
      .post(`${API_URL}/${this.entity}/login`, data)
      .pipe(tap(response => this.authService.handleLoginResponse(response)));
  }
}
