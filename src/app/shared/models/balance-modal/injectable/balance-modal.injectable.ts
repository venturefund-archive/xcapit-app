import { Injectable } from '@angular/core';
import BalanceModal from '../balance-modal';

@Injectable({ providedIn: 'root' })
export default class BalanceModalInjectable {
    constructor(
        private readonly _aModalController: ModalController | FakeModalController,
        private readonly _aTranslateService: TranslateService | FakeTranslateService
    ){}
  public create(
    _aToken: Token,
    _aDescriptionKey: string,
    _aPrimaryButtonKey: string,
    _aSecondaryButtonKey: string,
    _aModalController: ModalController,
    _aTranslateService: TranslateService
  ): BalanceModal {
    return new BalanceModal(null, null, null, null, null, null);
  }
}
