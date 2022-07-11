import { BigNumber } from 'ethers';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { Blockchain } from '../blockchain/blockchain';
import { fakeProviders } from '../fakes/fake-ethers-providers';
import { rawEthereumData } from '../fixtures/raw-blockchains-data';
import { GasStationOf } from '../gas-station-of/gas-station-of';


export class FeeOf implements Fee {

  constructor(private _aGasUnits: BigNumber, private _aGasPriceValue: BigNumber) {}

  async value(): Promise<BigNumber> {
    return this._aGasPriceValue.mul(this._aGasUnits);
  }
}

fdescribe('Fee Of', () => {
  let fee: FeeOf;
  const gasStation = new GasStationOf(new Blockchain(rawEthereumData), new FakeHttpClient(), fakeProviders);

  beforeEach(async () => {
    fee = new FeeOf(
      BigNumber.from(10),
      await gasStation.price().fast()
    );
  });

  it('new', () => {
    expect(fee).toBeTruthy();
  });

  it('value', async () => {
    expect(await fee.value()).toBeTruthy();
  });
});
