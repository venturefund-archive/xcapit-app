import { SimpleSubject, Subscribable } from '../../../../../../shared/models/simple-subject/simple-subject';
import { IBlockchain } from '../../blockchain/blockchain';
import { BlockchainTx } from '../../blockchain-tx';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { Wallet } from '../wallet';

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
