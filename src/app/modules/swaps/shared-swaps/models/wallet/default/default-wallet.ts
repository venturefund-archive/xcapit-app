import { SimpleSubject, Subscribable } from '../../../../../../shared/models/simple-subject/simple-subject';
import { IBlockchain } from '../../blockchain/blockchain';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { providers } from 'ethers';
import { BlockchainTx } from '../../blockchain-tx';
import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { MnemonicOf } from '../../../../../wallets/shared-wallets/models/mnemonic-of/mnemonic-of';
import { Password } from '../../password/password';
import { Wallet } from '../wallet';

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
