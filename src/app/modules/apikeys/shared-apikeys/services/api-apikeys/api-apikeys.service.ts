import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { CustomHttpService } from '../../../../../shared/services/custom-http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiApikeysService {
  entity = 'apikeys';

  crud: CRUD;

  constructor(
    private crudService: CrudService,
    private http: CustomHttpService
  ) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getByFundName(fundName: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/fund_name/${fundName}`);
  }
}
