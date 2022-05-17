import { providers } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ERC20Provider } from './erc20-provider.interface';

export class DefaultERC20Provider implements ERC20Provider {
  constructor(private readonly _aCoin: Coin) {}

  coin(): Coin {
    return this._aCoin;
  }

  value(): providers.JsonRpcProvider {
    return new providers.JsonRpcProvider(this._aCoin.rpc);
  }
}
