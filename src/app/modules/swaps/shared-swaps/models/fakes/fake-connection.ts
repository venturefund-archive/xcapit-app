import { BlockhashWithExpiryBlockHeight, PublicKey, Signer, TokenAccountsFilter, Transaction } from '@solana/web3.js';


export class FakeConnection {

  constructor(
    private _tokenAccountByOwnerReturned = [{ pubkey: 'asdf' }]
  ) { }

  getTokenAccountsByOwner(ownerAddress: PublicKey, filter: TokenAccountsFilter): Promise<{value: [{ pubkey }]} | any> {
    return Promise.resolve({ value: this._tokenAccountByOwnerReturned });
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
