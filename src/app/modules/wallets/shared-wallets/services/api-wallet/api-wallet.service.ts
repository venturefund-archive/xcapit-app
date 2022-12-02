import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { PROD_COINS } from '../../constants/coins.prod';
import { NONPROD_COINS } from '../../constants/coins.nonprod';
import { Coin } from '../../interfaces/coin.interface';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';


@Injectable({
  providedIn: 'root',
})
export class ApiWalletService {
  entity = 'wallet';
  env = environment.environment;
  constructor(
    private http: CustomHttpService,
    private _gasStation: GasStationOfFactory,
    private _blockchains: BlockchainsFactory
  ) { }

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

  getNetworks(coin?: string): string[] {
    if (coin) {
      return this.getCoins().filter(c => c.value === coin).map(c => c.network);
    }
    return Object.keys(environment.derivedPaths);
  }

  getWalletNewNetworks(encryptedWallet: any) {
    return this.getNetworks().filter((network) => !Object.keys(encryptedWallet.addresses).includes(network));
  }

  getCoin(coin: string, network: string): Coin {
    return this.getCoins().find((coinRes) => coinRes.value === coin && coinRes.network === network);
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

  async getGasPrice(aBlockchainName: string = "MATIC") {
    return (await this._gasStation.create(
      this._blockchains.create().oneByName(aBlockchainName)
    ).price().standard()).weiValue();
  }

  getInitialTokens(): Coin[] {
    return this.getCoins().filter((coin) => coin.native || coin.canInvest);
  }
}
