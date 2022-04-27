import { BigNumber } from 'ethers';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { Provider } from '@angular/core';
import { NativeGasOf } from './native-gas-of';

describe('NativeGasOf', () => {
  let providerSpy: jasmine.SpyObj<Provider>;
  let erc20ProviderSpy: jasmine.SpyObj<ERC20Provider>;
  let coinSpy: jasmine.SpyObj<Coin>;
  beforeEach(() => {
    providerSpy = jasmine.createSpyObj(
      'Provider',
      { estimateGas: Promise.resolve(BigNumber.from('21000')) },
      {
        _isProvider: true,
      }
    );
    erc20ProviderSpy = jasmine.createSpyObj('ERC20Provider', {
      value: providerSpy,
      coin: coinSpy,
    });

    coinSpy = jasmine.createSpyObj('Coin', {}, { rpc: '' });
  });

  it('new', () => {
    expect(new NativeGasOf(erc20ProviderSpy, { to: '0x0001', value: '100000' })).toBeTruthy();
  });

  it('create', () => {
    expect(NativeGasOf.create(coinSpy, { to: '0x0001', value: '100000' })).toBeTruthy();
  });

  it('value', async () => {
    expect((await new NativeGasOf(erc20ProviderSpy, { to: '0x0001', value: '100000' }).value()).toString()).toEqual(
      '21000'
    );
  });
});
