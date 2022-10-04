import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { BlockchainTx } from 'src/app/modules/swaps/shared-swaps/models/blockchain-tx';
import { FakeWallet, Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';


fdescribe('NativeSendTxOf', () => {
  let transaction: NativeSendTxOf;

  beforeEach(() => {
    transaction = new NativeSendTxOf(
      new FakeWallet(
        Promise.resolve(false),
        '',
        'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH'
      ),
      'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH',
      1
    );
  });

  it('new', () => {
    expect(transaction).toBeTruthy();
  });

  // TODO: ver si es suficiente con toBeTruthy...
  it('value', async () => {
    expect(await transaction.value()).toBeTruthy();
  });
});
