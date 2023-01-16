import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { SwapInProgress } from '../../models/swap-in-progress/swap-in-progress';

@Injectable({
  providedIn: 'root',
})
export class TxInProgressService {
  private _txInProgress: TxInProgress[] = [];
  private _inProgress: Subject<TxInProgress[]> = new BehaviorSubject<TxInProgress[]>([]);

  constructor(private ionicStorage: IonicStorageService) {}

  startTx(tx: TxInProgress) {
    this._txInProgress.push(tx);
    this._inProgress.next(structuredClone(this._txInProgress));
    new SwapInProgress(this.ionicStorage).start();
  }

  finishTx(tx: TxInProgress) {
    const index = this._txInProgress.indexOf(tx);
    this._txInProgress.splice(index, 1);
    this._inProgress.next(structuredClone(this._txInProgress));
    new SwapInProgress(this.ionicStorage).finish();
  }

  inProgress(): Observable<TxInProgress[]> {
    return this._inProgress.asObservable();
  }
}
