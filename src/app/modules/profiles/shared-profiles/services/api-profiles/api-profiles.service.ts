import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CRUD } from 'src/app/shared/services/crud/crud';

@Injectable({
  providedIn: 'root'
})
export class ApiProfilesService {

  crud: CRUD;

  entity = 'profiles';

  constructor(private crudService: CrudService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }
}
