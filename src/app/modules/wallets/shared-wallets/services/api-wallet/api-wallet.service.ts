import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiWalletService {
  crud: CRUD;

  entity = 'wallet';

  constructor(private crudService: CrudService, private http: CustomHttpService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getPrices(coins: string[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/get_symbol_prices`, {
      bases: coins,
    });
  }
}
