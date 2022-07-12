import { HttpClient } from '@angular/common/http';
import { BigNumber } from 'ethers';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { GasPrice } from '../gas-price/gas-price';
import { BigNumberOf } from './big-number-of';


export type RawGSFee = {
  maxPriorityFee: number,
  maxFee: number
};


export type RawPolygonGS = {
  safeLow: RawGSFee;
  standard: RawGSFee;
  fast: RawGSFee;
  estimatedBaseFee: number;
  blockTime: number;
  blockNumber: number;
}


export class PolygonGasPrices implements GasPrice {

  private readonly _url = 'https://gasstation-mainnet.matic.network/v2';

  constructor(private _httpClient: HttpClient | FakeHttpClient) { }

  async safeLow(): Promise<BigNumber> {
    return this._bigNumberOf((await this._gasData()).safeLow.maxFee).value();
  }

  async standard(): Promise<BigNumber> {
    return this._bigNumberOf((await this._gasData()).standard.maxFee).value();
  }

  async fast(): Promise<BigNumber> {
    return this._bigNumberOf((await this._gasData()).fast.maxFee).value();
  }

  private _bigNumberOf(aGweiAmount: number) {
    return new BigNumberOf(aGweiAmount);
  }

  private async _gasData(): Promise<RawPolygonGS> {
    return await this._httpClient.get(this._url).toPromise();
  }
}
