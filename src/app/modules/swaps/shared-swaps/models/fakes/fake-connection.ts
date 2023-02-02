import { BlockhashWithExpiryBlockHeight, Signer, Transaction } from '@solana/web3.js';


export class FakeConnection {
  sendTransaction(transaction: Transaction, signers: Signer[]): Promise<string> {
    return Promise.resolve('testHash');
  }

  async getLatestBlockhash(): Promise<BlockhashWithExpiryBlockHeight> {
    return {
      blockhash: 'aHash',
      lastValidBlockHeight: 1
    };
  }
}
