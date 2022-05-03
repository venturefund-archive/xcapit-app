import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ERC20Provider } from '../erc20-provider.interface';

export class FakeERC20Provider implements ERC20Provider {
  constructor(private readonly _coinReturn?: Coin, private readonly _valueReturn?: any) {}

  coin(): Coin {
    return this._coinReturn;
  }

  value(): any {
    return this._valueReturn;
  }
}
