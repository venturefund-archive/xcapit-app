import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { PROD_COINS } from '../../constants/coins.prod';
import { NONPROD_COINS } from '../../constants/coins.nonprod';
@Injectable({
  providedIn: 'root',
})
export class ApiWalletService {
  crud: CRUD;

  entity = 'wallet';
  env = environment.environment;
  constructor(private crudService: CrudService, private http: CustomHttpService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getPrices(coins: string[], loading = true): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/get_symbol_prices`,
      {
        bases: coins,
      },
      null,
      loading
    );
  }

  getCoins() {
    return this.env === 'PRODUCCION' ? PROD_COINS : NONPROD_COINS;
  }
}
