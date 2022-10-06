import { Signer, Transaction } from '@solana/web3.js';

export class FakeConnection {
  sendTransaction(transaction: Transaction, signers: Signer[]): Promise<boolean> {
    return Promise.resolve(true);
  }
}
