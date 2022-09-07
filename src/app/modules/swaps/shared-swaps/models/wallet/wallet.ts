import { SimpleSubject, Subscribable } from '../simple-subject/simple-subject';
import { Wallet as EthersWallet, providers, ethers } from 'ethers';
import { BlockchainTx } from '../blockchain-tx';
import { Blockchain } from '../blockchain/blockchain';
import { Keypair } from '@solana/web3.js'

export interface Wallet {
  address: () => string;
  onNeedPass: () => Subscribable;
  onDecryptedWallet: () => Subscribable;
  sendTxs: (transactions: BlockchainTx[]) => Promise<boolean>;
}

export class DefaultWallet implements Wallet {
  private _onNeedPass: SimpleSubject = new SimpleSubject();
  private _onWalletDecrypted: SimpleSubject = new SimpleSubject();

  constructor(
    private _rawData: any,
    private _aBlockchain: Blockchain,
    private _ethersWallet: any = EthersWallet,
    private _ethersProviders: any = providers
  ) {}

  address(): string {
    return this._rawData['address'].toLowerCase();
  }

  onDecryptedWallet(): Subscribable {
    return this._onWalletDecrypted;
  }

  onNeedPass(): Subscribable {
    return this._onNeedPass;
  }

  async sendTxs(transactions: BlockchainTx[]): Promise<boolean> {
    const connectedWallet = this._connectedWallet(this._derivedWallet(await this._decryptedWallet()));
    for (const tx of transactions) {
      await (await connectedWallet.sendTransaction(await tx.value())).wait();
    }
    return true;
  }

  encryptedWallet(): string {
    return this._rawData['encryptedWallet'];
  }

  private async _decryptedWallet(): Promise<EthersWallet> {
    const password = await this._onNeedPass.notify();
    return this._ethersWallet
      .fromEncryptedJson(this.encryptedWallet(), password)
      .then((decryptedWallet: EthersWallet) => {
        this._onWalletDecrypted.notify();
        return decryptedWallet;
      });
  }

  private _derivedWallet(aEthersWallet: EthersWallet): EthersWallet {
    return this._ethersWallet.fromMnemonic(aEthersWallet.mnemonic.phrase, this._aBlockchain.derivedPath());
  }

  private _connectedWallet(aEthersWallet: EthersWallet): EthersWallet {
    return aEthersWallet.connect(new this._ethersProviders.JsonRpcProvider(this._aBlockchain.rpc()));
  }
}

export class FakeWallet implements Wallet {
  private _onNeedPass: SimpleSubject = new SimpleSubject();
  private _onWalletDecrypted: SimpleSubject = new SimpleSubject();

  constructor(
    private readonly sendTxsResponse: Promise<any> = Promise.resolve(false),
    private msgError: string = ''
  ) {}

  public onNeedPass(): Subscribable {
    return this._onNeedPass;
  }

  public onDecryptedWallet(): Subscribable {
    return this._onWalletDecrypted;
  }

  async sendTxs(transactions: BlockchainTx[]): Promise<boolean> {
    await this._onNeedPass.notify();
    this._checkError();
    await this._onWalletDecrypted.notify();
    return this.sendTxsResponse;
  }

  address(): string {
    return '';
  }

  private _checkError() {
    if (this.msgError) {
      throw new Error(this.msgError);
    }
  }
}

export class SolanaWallet implements Wallet { 
  private _onNeedPass: SimpleSubject = new SimpleSubject();
  private _onWalletDecrypted: SimpleSubject = new SimpleSubject();

  constructor(
    private _rawData: any,
    private _solanaWallet: any = Keypair,
  ) {}
  
  sendTxs: (transactions: BlockchainTx[]) => Promise<boolean>;

  address(): string {
    return this._rawData['address'];
  }

  onDecryptedWallet(): Subscribable {
    return this._onWalletDecrypted;
  }

  onNeedPass(): Subscribable {
    return this._onNeedPass;
  }

  private _encryptedWallet(): string {
    return this._rawData['encryptedWallet'];
  }

  private async _decryptedWallet(): Promise<EthersWallet> {
    const password = await this._onNeedPass.notify();
    return this._solanaWallet
      .fromEncryptedJson(this._encryptedWallet(), password)
      .then((decryptedWallet: EthersWallet) => {
        this._onWalletDecrypted.notify();
        return decryptedWallet;
      });
  }

  private _derivedWallet(aEthersWallet: EthersWallet): SolanaWallet {
    const seed = ethers.utils.mnemonicToSeed(aEthersWallet.mnemonic.phrase);
    const arraySeed = ethers.utils.arrayify(seed);
    return this._solanaWallet.fromSeed(arraySeed.slice(0, 32));
  }
}
