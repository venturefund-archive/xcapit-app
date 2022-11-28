import { BlockhashWithExpiryBlockHeight, PublicKey, Signer, TokenAccountsFilter, Transaction } from '@solana/web3.js';


export class FakeConnection {

  getTokenAccountsByOwner(ownerAddress: PublicKey, filter: TokenAccountsFilter): Promise<{value: [{ pubkey }]}> {
    return Promise.resolve({value: [{ pubkey: 'asdf' }]});
  }

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
