import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config/app-constants.config';

@Injectable({
  providedIn: 'root'
})
export class ApiFundsService {

  entity = 'funds';

  crud: CRUD;

  constructor(
    private crudService: CrudService,
    private http: CustomHttpService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }
  getSubscribedFunds(): Observable<any> {
    return this.http.get(`${API_URL}/${this.entity}/subscribed_funds`);
  }

}
