import { GeneralWithButtonModal } from '../../general-with-button/general-with-button-modal';
import { BalanceModal } from '../../balance/balance-modal';
import { ModalFactory } from '../modal-factory.interface';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export enum Modals {
  GENERAL_WITH_BUTTON,
  BALANCE,
}

export class DefaultModalFactory implements ModalFactory {
  private _modalClasses = new Map<number, any>([
    [Modals.GENERAL_WITH_BUTTON, GeneralWithButtonModal],
    [Modals.BALANCE, BalanceModal],
  ]);
  constructor(private _aModalController: ModalController, private _aTranslateService: TranslateService) {}

  oneBy(modalType: Modals, args: any[]): any {
    const ModalClass = this._modalClasses.get(modalType);
    return new ModalClass(...args, this._aModalController, this._aTranslateService);
  }
}
