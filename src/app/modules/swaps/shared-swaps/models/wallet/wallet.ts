import { Wallet as EthersWallet, providers } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { BlockchainTx } from '../blockchain-tx';
import { Blockchain } from '../blockchain/blockchain';
import { SimpleSubject, Subscribable } from '../../../../../shared/models/simple-subject/simple-subject';
import { Connection, Transaction } from '@solana/web3.js';
import { FakeConnection } from '../fakes/fake-connection';
import { SolanaDerivedWallet } from '../solana-derived-wallet/solana-derived-wallet';

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
    console.log('txs number', transactions.length);
    for (const tx of transactions) {
      const _tx = await tx.value();
      console.log('tx', _tx);
      const txSended = await connectedWallet.sendTransaction((_tx) as TransactionRequest);
      console.log('tx sended', txSended.hash);
      await (txSended).wait();
    }
    return true;
  }

  private _encryptedWallet(): string {
    return this._rawData['encryptedWallet'];
  }

  private async _decryptedWallet(): Promise<EthersWallet> {
    const password = await this._onNeedPass.notify();
    return this._ethersWallet
      .fromEncryptedJson(this._encryptedWallet(), password)
      .then((decryptedWallet: EthersWallet) => {
        this._onWalletDecrypted.notify();
        return decryptedWallet;
      });
  }

  private _derivedWallet(aEthersWallet: EthersWallet): EthersWallet {
    console.log('phrase', aEthersWallet.mnemonic.phrase);
    console.log('derived path', this._aBlockchain.derivedPath());
    const d = this._ethersWallet.fromMnemonic(aEthersWallet.mnemonic.phrase, this._aBlockchain.derivedPath());
    console.log('address', d.address);
    return d;
  }

  private _connectedWallet(aEthersWallet: EthersWallet): EthersWallet {
    return aEthersWallet.connect(new this._ethersProviders.JsonRpcProvider(this._aBlockchain.rpc()));
  }
}
export class SendTxsError extends Error {
  constructor(message: string, private url: string) {
    super(message);
    this.url = url;
  }
}
export class FakeWallet implements Wallet {
  private _onNeedPass: SimpleSubject = new SimpleSubject();
  private _onWalletDecrypted: SimpleSubject = new SimpleSubject();

  constructor(
    private readonly sendTxsResponse: Promise<any> = Promise.resolve(false),
    private error: Error = null,
    private _address: string = ''
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
    return this._address;
  }

  private _checkError() {
    if (this.error) {
      throw this.error;
    }
  }
}

export class SolanaWallet implements Wallet {
  private _onNeedPass: SimpleSubject = new SimpleSubject();
  private _onWalletDecrypted: SimpleSubject = new SimpleSubject();

  constructor(
    private _rawData: any,
    private _aBlockchain: Blockchain,
    private _connection: Connection | FakeConnection,
    private _ethersWallet: any = EthersWallet
  ) {}

  public static create(_rawData: any, _aBlockchain: Blockchain): SolanaWallet {
    return new this(_rawData, _aBlockchain, new Connection(_aBlockchain.rpc()));
  }

  async sendTxs(transactions: BlockchainTx[]): Promise<boolean> {
    await this._sendTxs(
      transactions,
      new SolanaDerivedWallet((await this._decryptedWallet()).mnemonic.phrase, this._aBlockchain)
    );
    return true;
  }

  private async _sendTxs(transactions: BlockchainTx[], wallet: SolanaDerivedWallet): Promise<void> {
    for (const tx of transactions) {
      await this._connection.sendTransaction((await tx.value()) as Transaction, [wallet.value()]);
    }
  }

  private async _decryptedWallet(): Promise<EthersWallet> {
    const password = await this._onNeedPass.notify();
    return this._ethersWallet
      .fromEncryptedJson(this._encryptedWallet(), password)
      .then((decryptedWallet: EthersWallet) => {
        this._onWalletDecrypted.notify();
        return decryptedWallet;
      });
  }

  private _encryptedWallet(): string {
    return this._rawData['encryptedWallet'];
  }

  address(): string {
    return this._rawData['address'];
  }

  onDecryptedWallet(): Subscribable {
    return this._onWalletDecrypted;
  }

  onNeedPass(): Subscribable {
    return this._onNeedPass;
  }
}
