import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { Wallets } from '../wallets.interface';
import { Wallet } from '../../wallet/wallet';

export class FakeWallets implements Wallets {
  constructor(private readonly _oneByReturn: Wallet = null) {}

  oneBy(aBlockchain: Blockchain): Promise<Wallet> {
    return Promise.resolve(this._oneByReturn);
  }
}
