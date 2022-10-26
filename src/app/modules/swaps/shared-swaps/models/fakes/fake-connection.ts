import { BlockhashWithExpiryBlockHeight, Signer, Transaction } from '@solana/web3.js';


export class FakeConnection {
  sendTransaction(transaction: Transaction, signers: Signer[]): Promise<boolean> {
    return Promise.resolve(true);
  }

  async getLatestBlockhash(): Promise<BlockhashWithExpiryBlockHeight> {
    return {
      blockhash: 'aHash',
      lastValidBlockHeight: 1
    };
  }
}
