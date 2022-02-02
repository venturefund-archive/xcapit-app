import { BigNumber } from 'ethers';

export interface Fee {
  value(): Promise<BigNumber>;
}
