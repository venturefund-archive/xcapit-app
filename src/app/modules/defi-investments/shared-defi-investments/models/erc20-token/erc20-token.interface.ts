import { BigNumber } from 'ethers';

export interface ERC20Token {
  balanceOf: (address: string) => Promise<BigNumber>;
}
