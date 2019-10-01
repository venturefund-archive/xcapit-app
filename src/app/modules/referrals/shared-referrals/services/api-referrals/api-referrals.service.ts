import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ApiReferralsService {

  crud: CRUD;

  entity = 'referrals';

  constructor(private crudService: CrudService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }
}
