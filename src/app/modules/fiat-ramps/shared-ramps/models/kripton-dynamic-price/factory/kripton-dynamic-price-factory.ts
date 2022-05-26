import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { KriptonDynamicPrice } from '../kripton-dynamic-price';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';

@Injectable({ providedIn: 'root' })
export class KriptonDynamicPriceFactory {
  public new(
    milliseconds: number,
    fiatCurrency: string,
    cryptoCurrency: Coin,
    http: HttpClient | FakeHttpClient
  ): KriptonDynamicPrice {
    return KriptonDynamicPrice.create(milliseconds, fiatCurrency, cryptoCurrency, http);
  }
}
