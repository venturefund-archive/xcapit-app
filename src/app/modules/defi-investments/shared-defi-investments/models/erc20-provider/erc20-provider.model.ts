import { providers } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

export class ERC20Provider {
  private readonly _coin: Coin;
  constructor(aCoin: Coin) {
    this._coin = aCoin;
  }

  coin(): Coin {
    return this._coin;
  }

  value(): providers.JsonRpcProvider {
    return new providers.JsonRpcProvider(this._coin.rpc);
  }
}
