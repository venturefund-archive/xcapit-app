import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
@Injectable({
  providedIn: 'root',
})
export class ApiApikeysService {
  entity = 'apikeys';
  crud: CRUD;

  constructor(
    private crudService: CrudService,
    private customHttp: CustomHttpService,
    private http: HttpClient
  ) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/${this.entity}/list`);
  }

  getByFundName(fundName: string): Observable<any> {
    return this.customHttp.get(
      `${environment.apiUrl}/${this.entity}/fund_name/${fundName}`
    );
  }

  create(apikey: any) {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/register`,
      apikey
    );
  }

  update(apikey: any, id: number) {
    return this.http.patch(
      `${environment.apiUrl}/${this.entity}/update/${id}/`,
      apikey
    );
  }

  delete(id: number) {
    return this.http.delete(
      `${environment.apiUrl}/${this.entity}/delete/${id}/`
    );
  }
}
