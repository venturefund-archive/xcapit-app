import { TestBed } from '@angular/core/testing';
import { ERC20TokenController } from './erc20-token.controller';
import { DefaultERC20Token } from '../default-erc20-token.model';
import { FakeContract } from '../../fake-contract/fake-contract.model';

describe('ERC20TokenController', () => {
  let service: ERC20TokenController;
  let erc20ContractSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    service = TestBed.inject(ERC20TokenController);
    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: new FakeContract({}),
    });
  });

  it('should create', () => {
    expect(service.new(erc20ContractSpy)).toBeInstanceOf(DefaultERC20Token);
  });
});
