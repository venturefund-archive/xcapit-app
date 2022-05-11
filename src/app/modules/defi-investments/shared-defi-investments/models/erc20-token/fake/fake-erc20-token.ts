import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { ERC20Token } from '../erc20-token.interface';

export class FakeERC20Token implements ERC20Token {
  constructor(private readonly _balanceOfReturn) {}

  balanceOf(address: string): Promise<BigNumber> {
    return this._balanceOfReturn;
  }
}
