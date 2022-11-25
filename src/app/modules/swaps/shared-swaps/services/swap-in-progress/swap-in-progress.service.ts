import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { IonicStorageService } from "src/app/shared/services/ionic-storage/ionic-storage.service";
import { SwapInProgress } from "../../models/swap-in-progress/swap-in-progress";

@Injectable({
    providedIn: 'root',
  })
export class SwapInProgressService {
    private _inProgress: Subject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(private ionicStorage: IonicStorageService ){

    }

    startSwap() {
      this._inProgress.next(true);
      new SwapInProgress(this.ionicStorage).start();
    }
  
    finishSwap() {
      this._inProgress.next(false);
      new SwapInProgress(this.ionicStorage).finish();
    }
  
    inProgress(): Observable<boolean> {
      return this._inProgress.asObservable();
    }
  }
  