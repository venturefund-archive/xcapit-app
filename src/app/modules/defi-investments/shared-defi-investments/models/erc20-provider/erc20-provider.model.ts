import { providers } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

export class ERC20Provider {
  constructor(private readonly _aCoin: Coin) {}

  coin(): Coin {
    return this._aCoin;
  }

  value(): providers.JsonRpcProvider {
    return new providers.JsonRpcProvider(this._aCoin.rpc);
  }
}
