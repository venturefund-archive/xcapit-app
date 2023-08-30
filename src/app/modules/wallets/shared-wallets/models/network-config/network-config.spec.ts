import { NetworkConfig } from './network-config';
import { GasStationOf } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/gas-station-of';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { rawPolygonGasStation } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-polygon-gs-data';
import { rawPolygonData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { fakeProviders } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-ethers-providers';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { BigNumberOf } from 'src/app/modules/swaps/shared-swaps/models/polygon-gas-price/big-number-of';
import { AmountOf } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';


describe('NetworkConfig', () => {
  const gasStation = new GasStationOf(
    new Blockchain(rawPolygonData),
    new FakeHttpClient(rawPolygonGasStation),
    fakeProviders
  )

  it('should create', () => {
    expect(new NetworkConfig('', gasStation)).toBeTruthy();
  });

  it('should return empty config if network is not polygon', async () => {
    expect(await new NetworkConfig('ERC20', gasStation).value()).toEqual({});
  });

  it('should return gas config if network is polygon and a gas staion is passed', async () => {
    const expectedResult = new AmountOf(
      new BigNumberOf(rawPolygonGasStation.standard.maxFee).value().toString(),
      new DefaultToken(rawMATICData)
    );
    const config = new NetworkConfig('MATIC', gasStation);

    expect(await config.value()).toEqual({ gasPrice: expectedResult.weiValue() });
  });
});
