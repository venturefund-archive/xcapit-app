import { TestBed } from '@angular/core/testing';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { Erc20ProviderInjectable } from './erc20-provider.injectable';
import { DefaultERC20Provider } from '../erc20-provider.model';

describe('ERC20ProviderInjectable', () => {
  let service: Erc20ProviderInjectable;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { logoRoute: '', value: 'ETH', name: 'Ethereum', network: 'ERC20' });
    service = TestBed.inject(Erc20ProviderInjectable);
  });

  it('should create', () => {
    expect(service.create(coinSpy)).toBeInstanceOf(DefaultERC20Provider);
  });
});
