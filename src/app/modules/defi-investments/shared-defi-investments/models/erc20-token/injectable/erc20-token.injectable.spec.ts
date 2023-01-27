import { TestBed } from '@angular/core/testing';
import { ERC20TokenInjectable } from './erc20-token.injectable';
import { DefaultERC20Token } from '../default-erc20-token.model';
import { FakeContract } from '../../fake-contract/fake-contract.model';

describe('ERC20TokenInjectable', () => {
  let service: ERC20TokenInjectable;
  let erc20ContractSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    service = TestBed.inject(ERC20TokenInjectable);
    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: new FakeContract({}),
    });
  });

  it('should create', () => {
    expect(service.create(erc20ContractSpy)).toBeInstanceOf(DefaultERC20Token);
  });
});
