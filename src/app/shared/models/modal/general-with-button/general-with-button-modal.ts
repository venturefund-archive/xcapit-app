import { GeneralModalWithButtonComponent } from 'src/app/shared/components/general-modal-with-button/general-modal-with-button.component';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { FakeModalController } from '../../modal-controller/fake/fake-modal-controller';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular/providers/modal-controller';
import { ModalOptions } from '@ionic/core';
import { Modal } from '../modal.interface';

export class GeneralWithButtonModal implements Modal {
  private _modal: HTMLIonModalElement;
  constructor(
    private readonly _aTitleKey: string,
    private readonly _aDescriptionKey: string,
    private readonly _aButtonTextKey: string,
    private readonly _aUrl: string,
    private readonly _aModalController: ModalController | FakeModalController,
    private readonly _aTranslateService: TranslateService | FakeTranslateService
  ) {}

  async show(config = {}) {
    this._modal = await this._aModalController.create(this._modalConfig(config));
    await this._modal.present();
  }

  async onDidDismiss() {
    return this._modal.onDidDismiss();
  }

  private _modalConfig(config: any): ModalOptions {
    return {
      component: GeneralModalWithButtonComponent,
      cssClass: 'modal-large',
      backdropDismiss: false,
      componentProps: this._props(),
      ...config,
    };
  }
  private _props() {
    return {
      title: this._translate(this._aTitleKey),
      description: this._translate(this._aDescriptionKey),
      buttonText: this._translate(this._aButtonTextKey),
      url: this._aUrl,
    };
  }

  private _translate(aTranslateText: string) {
    return this._aTranslateService.instant(aTranslateText);
  }
}
