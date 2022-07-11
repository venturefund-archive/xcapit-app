import { BigNumber } from 'ethers';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { Blockchain } from '../blockchain/blockchain';
import { fakeProviders } from '../fakes/fake-ethers-providers';
import { rawEthereumData } from '../fixtures/raw-blockchains-data';
import { GasStationOf } from '../gas-station-of/gas-station-of';
import { FeeOf } from './fee-of';


fdescribe('Fee Of', () => {
  let fee: FeeOf;
  const gasUnits = BigNumber.from(10);
  const gasStation = new GasStationOf(new Blockchain(rawEthereumData), new FakeHttpClient(), fakeProviders);

  beforeEach(async () => {
    fee = new FeeOf(
      gasUnits,
      await gasStation.price().fast()
    );
  });

  it('new', () => {
    expect(fee).toBeTruthy();
  });

  it('value', async () => {
    expect((await fee.value()).toNumber()).toBeGreaterThan(0);
  });
});
