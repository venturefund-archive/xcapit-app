import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress';

@Injectable({
  providedIn: 'root',
})
export class TxInProgressService {
  private _inProgress: BehaviorSubject<TxInProgress[]> = new BehaviorSubject<TxInProgress[]>([]);

  constructor() {}

  startTx(tx: TxInProgress) {
    const currentTxs = this._inProgress.value;
    currentTxs.push(tx);
    this._inProgress.next(currentTxs);
  }

  finishTx(tx: TxInProgress) {
    const currentTxs = this._inProgress.value;
    const updatedTransactions = currentTxs.filter((currentTx) => currentTx.startTimestamp !== tx.startTimestamp);
    this._inProgress.next(updatedTransactions);
  }

  inProgress(): Observable<TxInProgress[]> {
    return this._inProgress.asObservable();
  }
}
