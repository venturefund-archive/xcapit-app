import { Contract } from 'ethers';
import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { ERC20Token } from './erc20-token.model';
import { BigNumber } from '@ethersproject/bignumber';

describe('ERC20Token', () => {
  let token: ERC20Token;
  let erc20ContractSpy: jasmine.SpyObj<ERC20Contract>;
  let contractSpy: jasmine.SpyObj<Contract>;
  beforeEach(() => {
    contractSpy = jasmine.createSpyObj('Contract', {
      approve: Promise.resolve({}),
      balanceOf: Promise.resolve(BigNumber.from('5000000000000000000')),
    });
    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: contractSpy,
      getGasPrice: Promise.resolve(BigNumber.from(1)),
    });
    token = new ERC20Token(erc20ContractSpy);
  });

  it('should create', () => {
    expect(token).toBeTruthy();
  });

  it('should call contract approve', async () => {
    await token.approve('0x000000001', BigNumber.from('500000'), BigNumber.from('100000000000'));
    expect(contractSpy.approve).toHaveBeenCalledOnceWith('0x000000001', BigNumber.from('500000'), {
      gasPrice: BigNumber.from('100000000000'),
    });
  });

  it('should call getGasPrice on getGasPrice', async () => {
    const gasPrice = await token.getGasPrice();
    expect(erc20ContractSpy.getGasPrice).toHaveBeenCalledTimes(1);
    expect(gasPrice).toEqual(BigNumber.from(1));
  });

  it('should get balance from address on balanceOf', async () => {
    const balance = await token.balanceOf('testAddress');
    expect(contractSpy.balanceOf).toHaveBeenCalledTimes(1);
    expect(balance).toEqual(BigNumber.from('5000000000000000000'));
  });
});
