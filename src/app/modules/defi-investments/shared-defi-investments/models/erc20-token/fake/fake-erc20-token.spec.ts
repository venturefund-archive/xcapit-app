import { BigNumber } from 'ethers';
import { FakeERC20Token } from './fake-erc20-token';

describe('FakeERC20Token', () => {
  it('should create', () => {
    expect(new FakeERC20Token(BigNumber.from('1'))).toBeTruthy();
  });

  it('should return balanceOf address', async () => {
    expect(await new FakeERC20Token(BigNumber.from('2')).balanceOf('')).toEqual(BigNumber.from('2'));
  });
});
