import { Blockchain } from "../blockchain/blockchain";
import { DefaultWallet } from "../wallet/wallet";
import { WalletRepo } from "../wallet-repo/wallet-repo";


export class Wallets {

  constructor(private _dataRepo: WalletRepo) { }

  async oneBy(aBlockchain: Blockchain): Promise<DefaultWallet> {
    return new DefaultWallet(await this._rawWalletData(aBlockchain), aBlockchain);
  }

  private async _rawWalletData(aBlockchain: Blockchain): Promise<any> {
    return {
      address: await this._dataRepo.addressByName(aBlockchain.name()),
      encryptedWallet: await this._dataRepo.encryptedRootWallet()
    }
  }
}
