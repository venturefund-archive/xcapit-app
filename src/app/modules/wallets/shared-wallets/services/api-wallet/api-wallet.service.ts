import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { PROD_COINS } from '../../constants/coins.prod';
import { NONPROD_COINS } from '../../constants/coins.nonprod';
import { Coin } from '../../interfaces/coin.interface';
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

  getCoins(): Coin[] {
    return this.env === 'PRODUCCION' ? PROD_COINS : NONPROD_COINS;
  }

  getNativeTokenFromNetwork(network: string): Coin {
    return this.getCoins().find((coin) => coin.network === network && coin.native);
  }

  getCoinsFromNetwork(network: string): Coin[] {
    return this.getCoins().filter((coin) => coin.network === network);
  }

  getNetworks(): string[] {
    return Object.keys(environment.derivedPaths);
  }

  getWalletNewNetworks(encryptedWallet: any) {
    return this.getNetworks().filter((network) => !Object.keys(encryptedWallet.addresses).includes(network));
  }

  getCoin(coin: string, network?: string): Coin {
    if (network) {
      return this.getCoins().find((coinRes) => coinRes.value === coin && coinRes.network === network);
    }

    return this.getCoins().find((coinRes) => coinRes.value === coin);
  }

  createNFTRequest() {
    return this.http.post(`${environment.apiUrl}/${this.entity}/create_nft_request/`, undefined, undefined, false);
  }

  getNFTStatus() {
    return this.http.get(`${environment.apiUrl}/${this.entity}/get_nft_status`, undefined, undefined, false);
  }

  saveWalletAddresses(wallets: { network: string; address: string }[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/`, wallets);
  }
}
