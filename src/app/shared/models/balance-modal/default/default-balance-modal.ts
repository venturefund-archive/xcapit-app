import { ModalController } from '@ionic/angular/providers/modal-controller';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { TranslateService } from '@ngx-translate/core';
import { ModalOptions } from '@ionic/core';
import { BuyOrDepositTokenToastComponent } from 'src/app/modules/fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { BalanceModal } from '../balance-modal.interface';

class FakeModalController {
  //TODO: Sacar de aca y testear
  create(): Promise<any> {
    return Promise.resolve({
      present: () => Promise.resolve(),
      onDidDismiss: () => ({ role: 'closed', data: 'aData' }),
    });
  }
}
class FakeTranslateService {
  //TODO: Sacar de aca y testear
  instant(aTextToTranslate: string, aParams: Object): string {
    return 'translatedText';
  }
}

export default class DefaultBalanceModal implements BalanceModal {
  private _modal: HTMLIonModalElement;
  constructor(
    private readonly _aToken: Token,
    private readonly _aDescriptionKey: string,
    private readonly _aPrimaryButtonKey: string,
    private readonly _aSecondaryButtonKey: string,
    private readonly _aModalController: ModalController | FakeModalController,
    private readonly _aTranslateService: TranslateService | FakeTranslateService
  ) {}

  async show() {
    this._modal = await this._aModalController.create(this._modalConfig());
    await this._modal.present();
  }

  async onDidDismiss() {
    return this._modal.onDidDismiss();
  }

  private _modalConfig(): ModalOptions {
    return {
      component: BuyOrDepositTokenToastComponent,
      cssClass: 'ux-toast-warning-with-margin',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: this._props(),
    };
  }
  private _props() {
    return {
      text: this._translate(this._aDescriptionKey),
      primaryButtonText: this._translate(this._aPrimaryButtonKey),
      secondaryButtonText: this._translate(this._aSecondaryButtonKey),
      token: this._aToken,
    };
  }

  private _translate(aTranslateText: string) {
    return this._aTranslateService.instant(aTranslateText, this._tokenSymbol());
  }

  private _tokenSymbol() {
    return { token: this._aToken.symbol() };
  }
}
