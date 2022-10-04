import { Transaction } from '@solana/web3.js';
import { BlockchainTx } from 'src/app/modules/swaps/shared-swaps/models/blockchain-tx';
import { FakeWallet, Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';


export class NativeSendTxOf implements BlockchainTx {

    constructor(private _wallet: Wallet, private _to: string, private _amount: number) { }

    async value(): Promise<Transaction> {
      return null;
    }
}


fdescribe('NativeSendTxOf', () => {
  let transaction: NativeSendTxOf;

  beforeEach(() => {
    transaction = new NativeSendTxOf(new FakeWallet(), '', 1);
  });

  it('new', () => {
    expect(transaction).toBeTruthy();
  });

  it('value', async () => {
    expect(await transaction.value()).toBeTruthy();
  });
});
