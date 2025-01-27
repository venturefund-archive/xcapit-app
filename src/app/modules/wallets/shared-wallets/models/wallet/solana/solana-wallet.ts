import { SimpleSubject, Subscribable } from '../../../../../../shared/models/simple-subject/simple-subject';
import { IBlockchain } from '../../../../../swaps/shared-swaps/models/blockchain/blockchain';
import { Connection, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { FakeConnection } from '../../../../../swaps/shared-swaps/models/fakes/fake-connection';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { SolanaDerivedWallet } from '../../../../../swaps/shared-swaps/models/solana-derived-wallet/solana-derived-wallet';
import { MnemonicOf } from '../../mnemonic-of/mnemonic-of';
import { Password } from '../../../../../swaps/shared-swaps/models/password/password';
import { Wallet } from '../wallet';
import { BlockchainTx } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/blockchain-tx';

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
