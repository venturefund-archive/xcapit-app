import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { DefaultKriptonPrice } from '../default-kripton-price';

@Injectable({ providedIn: 'root' })
export class DefaultKriptonPriceFactory {
  public new(
    fiatCurrency: string,
    cryptoCurrency: Coin,
    mode: 'cash-in' | 'cash-out',
    httpClient: HttpClient | FakeHttpClient
  ): DefaultKriptonPrice {
    return new DefaultKriptonPrice(fiatCurrency, cryptoCurrency, mode, httpClient);
  }
}
