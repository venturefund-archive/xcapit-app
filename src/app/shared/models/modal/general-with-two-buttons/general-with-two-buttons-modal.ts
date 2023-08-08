import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { FakeModalController } from '../../modal-controller/fake/fake-modal-controller';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular/providers/modal-controller';
import { ModalOptions } from '@ionic/core';
import { Modal } from '../modal.interface';
import { Location } from '../../location/location.interface';
import { GeneralModalWithTwoButtonsComponent } from 'src/app/shared/components/general-modal-with-two-buttons/general-modal-with-two-buttons.component';

export class GeneralWithTwoButtonsModal implements Modal {
  private _modal: HTMLIonModalElement;
  constructor(
    private readonly _aLogo: string,
    private readonly _aHighlightedHeader: string,
    private readonly _aHeaderKey: string,
    private readonly _anInformationKey: string,
    private readonly _aLink: string,
    private readonly _aFirstButtonKey: string,
    private readonly _anEventFirstButton: string,
    private readonly _aUrlFirstButton: string,
    private readonly _aSecondButtonKey: string,
    private readonly _anEventSecondButton: string,
    private readonly _aUrlSecondButton: string,
    private readonly _anEventCloseButton: string,
    private readonly _isBuyOrDeposit: boolean,
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
      component: GeneralModalWithTwoButtonsComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: this._props(),
      ...config,
    };
  }
  private _props() {
    return {
      logo: this._aLogo,
      highlightedHeader: this._aHighlightedHeader ? this._translate(this._aHighlightedHeader) : '',
      header: this._translate(this._aHeaderKey),
      information: this._translate(this._anInformationKey),
      link: this._aLink,
      firstButton: this._translate(this._aFirstButtonKey),
      eventFirstButton: this._anEventFirstButton,
      urlFirstButton: this._aUrlFirstButton,
      secondButton: this._translate(this._aSecondButtonKey),
      eventSecondButton: this._anEventSecondButton,
      urlSecondButton: this._aUrlSecondButton,
      eventCloseButton: this._anEventCloseButton,
      isBuyOrDeposit: this._isBuyOrDeposit,
    };
  }

  private _translate(aTranslateText: string) {
    return this._aTranslateService.instant(aTranslateText);
  }
}
