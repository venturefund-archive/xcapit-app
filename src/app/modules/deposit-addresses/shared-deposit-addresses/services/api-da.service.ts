import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiDaService {
  entity = 'funds';

  crud: CRUD;

  constructor(
    private crudService: CrudService,
    private http: CustomHttpService
  ) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getDepositAddress(currency: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/deposit_address/${currency}`,
      '',
      undefined,
      false
    );
  }
}
