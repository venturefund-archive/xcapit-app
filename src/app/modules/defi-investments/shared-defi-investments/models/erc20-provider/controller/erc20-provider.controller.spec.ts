import { TestBed } from '@angular/core/testing';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ERC20ProviderController } from './erc20-provider.controller';
import { DefaultERC20Provider } from '../erc20-provider.model';

describe('ERC20ProviderController', () => {
  let service: ERC20ProviderController;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { logoRoute: '', value: 'ETH', name: 'Ethereum', network: 'ERC20' });
    service = TestBed.inject(ERC20ProviderController);
  });

  it('should create', () => {
    expect(service.new(coinSpy)).toBeInstanceOf(DefaultERC20Provider);
  });
});
