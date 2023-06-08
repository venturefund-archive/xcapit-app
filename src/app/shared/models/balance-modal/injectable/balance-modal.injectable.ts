import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import BalanceModal from '../balance-modal';
import { TranslateService } from '@ngx-translate/core';
import { Token } from '../../../../modules/swaps/shared-swaps/models/token/token';

@Injectable({ providedIn: 'root' })
export default class BalanceModalInjectable {
  constructor(
    private readonly _aModalController: ModalController,
    private readonly _aTranslateService: TranslateService
  ) {}
  public create(
    _aToken: Token,
    _aDescriptionKey: string,
    _aPrimaryButtonKey: string,
    _aSecondaryButtonKey: string,
    _aModalController: ModalController = this._aModalController,
    _aTranslateService: TranslateService = this._aTranslateService
  ): BalanceModal {
    return new BalanceModal(
      _aToken,
      _aDescriptionKey,
      _aPrimaryButtonKey,
      _aSecondaryButtonKey,
      _aModalController,
      _aTranslateService
    );
  }
}
