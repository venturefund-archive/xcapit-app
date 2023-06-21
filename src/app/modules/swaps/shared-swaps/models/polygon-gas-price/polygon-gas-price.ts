import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { AmountOf } from '../amount-of/amount-of';
import { Blockchain } from '../blockchain/blockchain';
import { GasPrice } from '../gas-price/gas-price';
import { BigNumberOf } from './big-number-of';

export type RawGSFee = {
  maxPriorityFee: string | number;
  maxFee: string | number;
};

export type RawPolygonGS = {
  safeLow: RawGSFee;
  standard: RawGSFee;
  fast: RawGSFee;
  estimatedBaseFee: string | number;
  blockTime: number;
  blockNumber: number;
};

export class PolygonGasPrice implements GasPrice {
  private readonly _url = environment.POLYGON_GAS_STATION;

  constructor(private _aBlockchain: Blockchain, private _httpClient: HttpClient | FakeHttpClient) {}

  async safeLow(): Promise<AmountOf> {
    return new AmountOf(
      this._bigNumberOf((await this._gasData()).safeLow.maxFee)
        .value()
        .toString(),
      this._aBlockchain.nativeToken()
    );
  }

  async standard(): Promise<AmountOf> {
    return new AmountOf(
      this._bigNumberOf((await this._gasData()).standard.maxFee)
        .value()
        .toString(),
      this._aBlockchain.nativeToken()
    );
  }

  async fast(): Promise<AmountOf> {
    return new AmountOf(
      this._bigNumberOf((await this._gasData()).fast.maxFee)
        .value()
        .toString(),
      this._aBlockchain.nativeToken()
    );
  }

  private _bigNumberOf(aGweiAmount: number | string) {
    return new BigNumberOf(aGweiAmount);
  }

  private async _gasData(): Promise<RawPolygonGS> {
    return await this._httpClient.get(this._url).toPromise();
  }
}
