import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { KriptonNetworks } from '../../constants/kripton-networks';
import { ProviderPrice } from '../provider-price/provider-price';

//TODO: Cambiar httpClinet por fiatRampService, reutilizar para ambos calculos (quotations y fee)
export class DefaultKriptonPrice implements ProviderPrice {
  kriptonNetworks = KriptonNetworks;
  constructor(
    private readonly _fiatCurrency: string,
    private readonly _cryptoCurrency: Coin,
    private readonly _httpClient: HttpClient | FakeHttpClient
  ) {}

  //El calculo es correcto, el precio a mostrar en el input no (deberia solo mostrar el amount_out)
  value(): Observable<number> {
    return this._price().pipe(
      map(
        (res) => 1 / ((parseFloat(res.data.amount_out) + parseFloat(res.data.costs)) / parseFloat(res.data.amount_in))
        // (res) => 1 / (parseFloat(res.data.amount_out) / parseFloat(res.data.amount_in))
      )
    );
  }

  //TODO: Evaluar si usamos este llamado o el de quotations
  private _price(): Observable<any> {
    return this._httpClient.post('https://app.kriptonmarket.com/public/calculate_amount_out', {
      currency_in: this._fiatCurrency,
      amount_in: 10000,
      currency_out: this._cryptoCurrency.value,
      type: 'cash-in',
      network_out: this._network(),
    });
  }

  private _network(): string {
    return this.kriptonNetworks[this._cryptoCurrency.network];
  }
}
