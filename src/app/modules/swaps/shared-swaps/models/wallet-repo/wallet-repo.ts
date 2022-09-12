import { Keypair } from '@solana/web3.js';
import { ethers } from 'ethers';
import { StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { environment } from 'src/environments/environment';
import { DataRepo } from './data-repo.interface';

export class WalletRepo implements DataRepo {
  private readonly _storageKey = 'enc_wallet';

  constructor(private _anStorage: StorageService) {}

  async addressByName(aBlockchainName: string): Promise<string> {
    return (await this._storedData()).addresses[aBlockchainName];
  }

  async encryptedRootWallet(): Promise<string> {
    return (await this._storedData()).wallet;
  }

  private async _storedData(): Promise<any> {
    return await this._anStorage.get(this._storageKey);
  }
}

export class NewWalletRepo implements DataRepo {
  public utils = ethers.utils;
  private _anEncryptedWallet: string;
  constructor(private _aPhrase: string, private _aPassword: string) {}

  addressByName(aBlockchainName: string): Promise<string> {
    if(aBlockchainName === 'SOLANA'){
      return Promise.resolve(this._createSolanaWallet(this._aPhrase).publicKey.toString());
    }

    return Promise.resolve(this._createEtherWallet(this._aPhrase, aBlockchainName).address.toLowerCase());
  }

  async encryptedRootWallet(): Promise<string> {
    if(!this._anEncryptedWallet){
      this._anEncryptedWallet = await this._createEtherWallet(this._aPhrase, 'ERC20').encrypt(this._aPassword)
    }
    return this._anEncryptedWallet;
  }

  private _createEtherWallet(aPhrase: string, aBlockchainName: string): ethers.Wallet {
    return ethers.Wallet.fromMnemonic(aPhrase, environment.derivedPaths[aBlockchainName], ethers.wordlists.en);
  }

  private _createSolanaWallet(aPhrase: string): Keypair{
    const aSeed = this.utils.mnemonicToSeed(aPhrase);
    const aSeedArray = this.utils.arrayify(aSeed).slice(0, 32);
    return Keypair.fromSeed(aSeedArray);
  }
}
