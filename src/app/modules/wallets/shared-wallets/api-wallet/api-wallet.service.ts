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
    return new Observable((observer) => {
      observer.next({
        prices: {
          BTC: 45099.8,
          ETH: 3042.55,
        },
        errors: [],
      });
    });
    return this.http.post(`${environment.apiUrl}/${this.entity}/get_token_prices`, {
      bases: coins,
    });
  }
}
