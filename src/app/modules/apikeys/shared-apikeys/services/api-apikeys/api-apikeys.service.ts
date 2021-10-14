import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
@Injectable({
  providedIn: 'root',
})
export class ApiApikeysService {
  entity = 'apikeys';
  crud: CRUD;

  constructor(private crudService: CrudService, private http: CustomHttpService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/${this.entity}/list`);
  }

  getByFundName(fundName: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/fund_name/${fundName}`);
  }

  create(apikey: any) {
    return this.http.post(`${environment.apiUrl}/${this.entity}/register`, apikey);
  }

  update(apikey: any, id: number) {
    return this.http.original.patch(`${environment.apiUrl}/${this.entity}/update/${id}/`, apikey);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/${this.entity}/delete/${id}/`);
  }

  checkMinBalance(data: any) {
    return this.http.post(`${environment.apiUrl}/${this.entity}/check_min_balance/`, data);
  }

  getAccountBalance(data: any): Observable<{ account_balance: number; currency: string }> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/account_balance/`, data);
  }
}
