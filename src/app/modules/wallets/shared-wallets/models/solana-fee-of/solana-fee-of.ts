import { Connection } from '@solana/web3.js';
import { FakeConnection } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-connection';
import { SolanaTxWithBlockhash } from 'src/app/modules/wallets/shared-wallets/models/solana-tx-with-blockhash/solana-tx-with-blockhash';
import { SolanaTxWithPayer } from 'src/app/modules/wallets/shared-wallets/models/solana-tx-with-payer/solana-tx-with-payer';
import { BlockchainTx } from '../blockchain-tx/blockchain-tx';

export class SolanaFeeOf {
  constructor(private _transactions: BlockchainTx[], private _connection: Connection | FakeConnection) {}

  async value(): Promise<number> {
    let result = 0;
    for (const transaction of this._transactions) {
      result += await this._estimatedFeeOf(transaction);
    }
    return result;
  }

  private async _estimatedFeeOf(aTransaction: BlockchainTx) {
    return await (
      await new SolanaTxWithBlockhash(new SolanaTxWithPayer(aTransaction), this._connection).value()
    ).getEstimatedFee(this._connection as Connection);
  }
}
