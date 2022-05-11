import { TestBed } from '@angular/core/testing';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ERC20ContractController } from './erc20-contract.controller';
import { ERC20Contract } from '../erc20-contract.model';
import { FakeERC20Provider } from '../../erc20-provider/fake/fake-erc20-provider';
import { VoidSigner } from 'ethers';
import { ERC20Provider } from '../../erc20-provider/erc20-provider.interface';

describe('ERC20ContractController', () => {
  let service: ERC20ContractController;
  let coinSpy: jasmine.SpyObj<Coin>;
  let fakeERC20Provider: ERC20Provider;

  beforeEach(() => {
    service = TestBed.inject(ERC20ContractController);
    fakeERC20Provider = new FakeERC20Provider(coinSpy);
  });

  it('should create', () => {
    expect(service.new(fakeERC20Provider, new VoidSigner('0x00000000001'))).toBeInstanceOf(ERC20Contract);
  });

  it('should create with default address', () => {
    expect(service.new(fakeERC20Provider)).toBeInstanceOf(ERC20Contract);
  });
});
