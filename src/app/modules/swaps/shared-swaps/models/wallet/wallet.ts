import { Wallet as EthersWallet, providers } from 'ethers';
import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { BlockchainTx } from '../blockchain-tx';
import { IBlockchain } from '../blockchain/blockchain';
import { SimpleSubject, Subscribable } from '../../../../../shared/models/simple-subject/simple-subject';
import { Connection, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { FakeConnection } from '../fakes/fake-connection';
import { SolanaDerivedWallet } from '../solana-derived-wallet/solana-derived-wallet';
import { Password } from '../password/password';
import { MnemonicOf } from 'src/app/modules/wallets/shared-wallets/models/mnemonic-of/mnemonic-of';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';

export interface Wallet {
  address: () => string;
  onNeedPass: () => Subscribable;
  sendTxs: (transactions: BlockchainTx[]) => Promise<boolean>;
  blockchain: () => IBlockchain;
  signMessage?: (message: string) => Promise<string>;
  sendTransaction?: (tx: BlockchainTx) => Promise<any>;
  signTypedData?: (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ) => any;
  signTransaction?: (tx: BlockchainTx) => Promise<any>;
}

export class DefaultWallet implements Wallet {
  private _onNeedPass: SimpleSubject = new SimpleSubject();

  constructor(
    private _rawData: any,
    private _aBlockchain: IBlockchain,
    private _ethersWallet: any = EthersWallet,
    private _ethersProviders: any = providers
  ) {}

  address(): string {
    return this._rawData['address'].toLowerCase();
  }

  blockchain(): IBlockchain {
    return this._aBlockchain;
  }
  onNeedPass(): Subscribable {
    return this._onNeedPass;
  }

  async sendTxs(transactions: BlockchainTx[]): Promise<boolean> {
    const connectedWallet = this._connectedWallet(await this._derivedWallet());
    for (const tx of transactions) {
      await (await connectedWallet.sendTransaction((await tx.value()) as TransactionRequest)).wait();
    }
    return true;
  }

  async sendTransaction(tx: BlockchainTx): Promise<TransactionResponse> {
    return this._connectedWallet(await this._derivedWallet()).sendTransaction((await tx.value()) as TransactionRequest);
  }

  async signMessage(message: string): Promise<string> {
    const connectedWallet = this._connectedWallet(await this._derivedWallet());
    return connectedWallet.signMessage(message);
  }

  public async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<any> {
    return this._connectedWallet(await this._derivedWallet())._signTypedData(domain, types, value);
  }

  async signTransaction(tx: BlockchainTx): Promise<string> {
    return this._connectedWallet(await this._derivedWallet()).signTransaction((await tx.value()) as TransactionRequest);
  }

  private _encryptedWallet(): string {
    return this._rawData['encryptedWallet'];
  }

  private async _derivedWallet(): Promise<EthersWallet> {
    return this._ethersWallet.fromMnemonic(
      await new MnemonicOf(
        new Password(await this._onNeedPass.notify()),
        this._encryptedWallet(),
        this._ethersWallet
      ).phrase(),
      this._aBlockchain.derivedPath()
    );
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

  constructor(
    private readonly sendTxsResponse: Promise<any> = Promise.resolve(false),
    private error: Error = null,
    private _address: string = '',
    private _blockchain: IBlockchain = null
  ) {}

  public onNeedPass(): Subscribable {
    return this._onNeedPass;
  }

  async sendTxs(transactions: BlockchainTx[]): Promise<boolean> {
    await this._onNeedPass.notify();
    this._checkError();
    return this.sendTxsResponse;
  }

  address(): string {
    return this._address;
  }

  blockchain(): IBlockchain {
    return this._blockchain;
  }

  async sendTransaction(tx: BlockchainTx): Promise<TransactionResponse> {
    return { hash: 'aTxHash' } as TransactionResponse;
  }

  async signMessage(message: string): Promise<string> {
    return 'signed message';
  }

  public async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<any> {
    await this._onNeedPass.notify();
    return Promise.resolve();
  }

  async signTransaction(tx: BlockchainTx): Promise<string> {
    await this._onNeedPass.notify();
    return Promise.resolve('a signed tx');
  }

  private _checkError() {
    if (this.error) {
      throw this.error;
    }
  }
}

export class SolanaWallet implements Wallet {
  private _onNeedPass: SimpleSubject = new SimpleSubject();

  constructor(
    private _rawData: any,
    private _aBlockchain: IBlockchain,
    private _connection: Connection | FakeConnection,
    private _ethersWallet: any = EthersWallet,
    private _sendAndConfirm: any = sendAndConfirmTransaction
  ) {}

  public static create(_rawData: any, _aBlockchain: IBlockchain): SolanaWallet {
    return new this(_rawData, _aBlockchain, new Connection(_aBlockchain.rpc()));
  }

  async sendTxs(transactions: BlockchainTx[]): Promise<boolean> {
    await this._sendTxs(transactions, new SolanaDerivedWallet(await this._mnemonicPhrase(), this._aBlockchain));
    return true;
  }

  private async _sendTxs(transactions: BlockchainTx[], wallet: SolanaDerivedWallet): Promise<void> {
    for (const tx of transactions) {
      await this._sendAndConfirm(this._connection as Connection, (await tx.value()) as Transaction, [wallet.value()]);
    }
  }

  private async _mnemonicPhrase(): Promise<string> {
    return await new MnemonicOf(
      new Password(await this._onNeedPass.notify()),
      this._encryptedWallet(),
      this._ethersWallet
    ).phrase();
  }

  private _encryptedWallet(): string {
    return this._rawData['encryptedWallet'];
  }

  address(): string {
    return this._rawData['address'];
  }

  blockchain(): IBlockchain {
    return this._aBlockchain;
  }
  onNeedPass(): Subscribable {
    return this._onNeedPass;
  }
}
