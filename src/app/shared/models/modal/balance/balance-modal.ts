import { ModalController } from '@ionic/angular/providers/modal-controller';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { TranslateService } from '@ngx-translate/core';
import { ModalOptions } from '@ionic/core';
import { BuyOrDepositTokenToastComponent } from 'src/app/modules/fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { FakeModalController } from '../../modal-controller/fake/fake-modal-controller';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { Modal } from '../modal.interface';
import { Location } from '../../location/location.interface';

export class BalanceModal implements Modal {
  private _modal: HTMLIonModalElement;
  constructor(
    private readonly _aToken: Token,
    private readonly _aDescriptionKey: string,
    private readonly _aPrimaryButtonKey: string,
    private readonly _aSecondaryButtonKey: string,
    private readonly _aModalController: ModalController | FakeModalController,
    private readonly _aTranslateService: TranslateService | FakeTranslateService,
    private readonly _location: Location
  ) {}

  async show(config = {}) {
    this._modal = await this._aModalController.create(this._modalConfig(config));
    await this._modal.present();
  }

  async showIn(url: string, config = {}) {
    if (this._location.href() === url) {
      await this.show(config);
    }
  }

  async onDidDismiss() {
    return this._modal.onDidDismiss();
  }

  private _modalConfig(config: any): ModalOptions {
    return {
      component: BuyOrDepositTokenToastComponent,
      cssClass: 'ux-toast-warning-with-margin',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: this._props(),
      ...config,
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
