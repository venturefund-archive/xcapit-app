import { Contract } from 'ethers';
import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { ERC20Token } from './erc20-token.model';

describe('ERC20Token', () => {
  let token: ERC20Token;
  let erc20ContractSpy: jasmine.SpyObj<ERC20Contract>;
  let contractSpy: jasmine.SpyObj<Contract>;
  beforeEach(() => {
    contractSpy = jasmine.createSpyObj('Contract', {
      approve: Promise.resolve({}),
    });
    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: contractSpy,
    });
    token = new ERC20Token(erc20ContractSpy);
  });

  it('should create', () => {
    expect(token).toBeTruthy();
  });

  it('should call contract approve', async () => {
    await token.approve('0x000000001', 50);
    expect(contractSpy.approve).toHaveBeenCalledOnceWith('0x000000001', 50);
  });
});
