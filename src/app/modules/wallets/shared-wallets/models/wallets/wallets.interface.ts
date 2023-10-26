import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { Wallet } from '../wallet/wallet';

export interface Wallets {
  oneBy(aBlockchain: Blockchain): Promise<Wallet>;
}
