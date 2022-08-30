import { Blockchain } from "../blockchain/blockchain";
import { Wallet, DefaultWallet, SolanaWallet } from "../wallet/wallet";
import { DataRepo } from "../wallet-repo/data-repo.interface";
export class Wallets {
  constructor(private _dataRepo: DataRepo) { }

  async oneBy(aBlockchain: Blockchain): Promise<Wallet> {
    const rawData = await this._rawWalletData(aBlockchain);

    if(aBlockchain.name() === 'SOLANA') {
      return new SolanaWallet(rawData, aBlockchain);
    }
    
    return new DefaultWallet(rawData, aBlockchain);
  }

  private async _rawWalletData(aBlockchain: Blockchain): Promise<any> {
    return {
      address: await this._dataRepo.addressByName(aBlockchain.name()),
      encryptedWallet: await this._dataRepo.encryptedRootWallet()
    }
  }
}
