import { Injectable } from '@angular/core';
import { IonicStorageService } from '../../../services/ionic-storage/ionic-storage.service';
import { LendersInjectable } from '../../lenders/injectable/lenders.injectable';
import { StorageService } from '../../../services/app-storage/app-storage.service';
import { ActiveLender } from '../active-lender';


@Injectable({ providedIn: 'root' })
export class ActiveLenderInjectable {
  constructor(private storage: IonicStorageService, private lendersInjectable: LendersInjectable) {}

  create(
    _aStorage: StorageService = this.storage,
    _aLendersInjectable: LendersInjectable = this.lendersInjectable
  ): ActiveLender {
    return new ActiveLender(_aStorage, _aLendersInjectable.create());
  }
}
