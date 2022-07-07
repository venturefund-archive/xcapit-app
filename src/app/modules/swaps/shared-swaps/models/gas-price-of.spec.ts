import { Blockchain } from './blockchain/blockchain';
import { rawPolygonData } from './fixtures/raw-blockchains-data';
import { providers } from './fakes/fake-ethers-providers';
import { BigNumber, utils } from 'ethers';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { HttpClient } from '@angular/common/http';



export class GasStationOf {

  constructor(private aBlockchain: Blockchain) {
    console.log("hi")
  }
}




fdescribe('Gas Station Of', () => {

  it('new', () => {
    expect(new GasStationOf(new Blockchain(rawPolygonData))).toBeTruthy();
  });
});











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

const rawPolygonGasStation: RawPolygonGS = {"safeLow":{"maxPriorityFee":33.664479934266666,"maxFee":35.494281265266665},"standard":{"maxPriorityFee":34.10264011906666,"maxFee":35.93244145006666},"fast":{"maxPriorityFee":35.6459197674,"maxFee":37.4757210984},"estimatedBaseFee":1.829801331,"blockTime":2,"blockNumber":30375091};

export interface GasPrice {
  safeLow(): Promise<BigNumber>;
  standard(): Promise<BigNumber>;
  fast(): Promise<BigNumber>;
}

export class BigNumberOf {

  constructor(private _aGweiAmount: number) { }

  value(): BigNumber {
    return utils.parseUnits(this._aGweiAmount.toFixed(9), 'gwei')
  }
}


export class PolygonGasPrice implements GasPrice {

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


fdescribe('Polygon Gas Price', () => {

  let gasPrice: PolygonGasPrice;

  beforeEach(() => {
    gasPrice = new PolygonGasPrice(new FakeHttpClient(rawPolygonGasStation));
  });

  it('new', () => {
    expect(gasPrice).toBeTruthy();
  });

  it('safeLow', async () => {
    const expectedResult = new BigNumberOf(rawPolygonGasStation.safeLow.maxFee).value();

    expect(await gasPrice.safeLow()).toEqual(expectedResult);
  });

  it('standard', async () => {
    const expectedResult = new BigNumberOf(rawPolygonGasStation.standard.maxFee).value();

    expect(await gasPrice.standard()).toEqual(expectedResult);
  });

  it('fast', async () => {
    const expectedResult = new BigNumberOf(rawPolygonGasStation.fast.maxFee).value();

    expect(await gasPrice.fast()).toEqual(expectedResult);
  });
});










export class DefaultGasPrice implements GasPrice {
  safeLow(): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  standard(): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  fast(): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }
}


export class GasPriceOf {
  constructor(private _aBlockchain: Blockchain, private _providers: any = providers) {}

  value() {
    return true;
  }

  // safeLow(): Promise<BigNumber> {
  //   return this._provider().getGasPrice();
  // }

  private _provider() {
    return new this._providers.JsonRpcProvider(this._aBlockchain.rpc());
  }
}

fdescribe('Gas Price Of', () => {
  let gasPrice: GasPriceOf;

  beforeEach(() => {
    gasPrice = new GasPriceOf(new Blockchain(rawPolygonData), providers);
  });

  it('new', () => {
    expect(gasPrice).toBeTruthy();
  });

  it('value', () => {
    expect(gasPrice.value()).toBeTruthy();
  });

  // it('safeLow', async () => {
  //   expect((await gasPrice.safeLow()).toNumber()).toBeGreaterThan(0);
  // });
});
