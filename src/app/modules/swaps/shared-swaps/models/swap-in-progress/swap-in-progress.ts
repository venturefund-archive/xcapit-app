import { Observable, Subject } from 'rxjs';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

export class SwapInProgress {
  constructor(
    private readonly _aStorage: IonicStorageService,
    private readonly _storageKey: string = 'swapInProgress'
  ) {}

  start() {
    this._aStorage.set(this._storageKey, 1);
  }

  finish(){
    this._aStorage.set(this._storageKey, 0);    
  }  
}
