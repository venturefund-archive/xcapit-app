import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress.interface';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { BlockchainsFactory } from '../../models/blockchains/factory/blockchains.factory';
import { SendTxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/send/send-tx-in-progress';
import { BlockchainTransactionResponsesInjectable } from 'src/app/modules/wallets/shared-wallets/models/blockchain-transactions/injectable/blockchain-transaction-responses.injectable';
import { JsonRpcProviderInjectable } from '../../../../wallets/shared-wallets/models/json-rpc-provider/injectable/json-rpc-provider.injectable';
import { DefaultTxHash } from '../../../../wallets/shared-wallets/models/tx-hash/default/default-tx-hash';

@Injectable({
  providedIn: 'root',
})
export class TxInProgressService {
  private _inProgress: BehaviorSubject<TxInProgress[]> = new BehaviorSubject<TxInProgress[]>([]);
  private _aStorageKey = 'in_progress_transactions';
  constructor(
    private ionicStorage: IonicStorageService,
    private blockchainTransactionResponsesInjectable: BlockchainTransactionResponsesInjectable,
    private jsonRpcProviderInjectable: JsonRpcProviderInjectable,
    private blockchainsFactory: BlockchainsFactory
  ) {}

  async startTx(tx: TxInProgress) {
    const currentTxs = this._inProgress.value;
    currentTxs.push(tx);
    await this.save(currentTxs);
    this._inProgress.next(currentTxs);
  }

  async finishTx(tx: TxInProgress) {
    const updatedTransactions = this._inProgress.value.filter((currentTx) => currentTx.timestamp() !== tx.timestamp());
    await this.save(updatedTransactions);
    this._inProgress.next(updatedTransactions);
  }

  async save(currentTxs: TxInProgress[]) {
    await this.ionicStorage.set(
      this._aStorageKey,
      currentTxs.map((tx) => tx.json())
    );
  }

  inProgress(): Observable<TxInProgress[]> {
    return this._inProgress.asObservable();
  }

  async checkTransactionStatus() {
    for (const tx of await this._storageSendTransactions()) {
      await this.startTx(tx);
      this._waitForATransaction(tx)
        .then(async () => await this.finishTx(tx))
        .catch(async () => await this.finishTx(tx));
    }
  }
  private async _waitForATransaction(tx: TxInProgress): Promise<void> {
    await (
      await this.blockchainTransactionResponsesInjectable
        .create(this.jsonRpcProviderInjectable.create(tx.blockchain().rpc()))
        .byHash(tx.hash().value())
    ).wait();
  }

  private async _storageTransactions() {
    return (await this.ionicStorage.get(this._aStorageKey)) ?? [];
  }
  private async _storageSendTransactions() {
    return (await this._storageTransactions())
      .filter((tx) => tx.type === 'send')
      .map(
        (tx) =>
          new SendTxInProgress(
            this.blockchainsFactory.create().oneByName(tx.blockchain),
            new DefaultTxHash(tx.hash),
            tx.timestamp
          )
      );
  }
}
