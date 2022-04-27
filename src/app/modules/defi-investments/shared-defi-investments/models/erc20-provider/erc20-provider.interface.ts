import { providers } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

export interface ERC20Provider {
  coin(): Coin;
  value(): providers.JsonRpcProvider;
}
