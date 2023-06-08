import { ModalController } from '@ionic/angular/providers/modal-controller';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken, Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { BuyOrDepositTokenToastComponent } from '../../../modules/fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalOptions } from '@ionic/core';

class FakeModalController {
  create(): Promise<any> {
    return Promise.resolve({ present: () => Promise.resolve() });
  }
}
class FakeTranslateService {
  instant(aTextToTranslate: string, aParams: Object): string {
    return 'translatedText';
  }
}

export default class BalanceModal {
  private _modal: HTMLIonModalElement;
  constructor(
    private readonly aToken: Token,
    private readonly text: string,
    private readonly primaryButtonText: string,
    private readonly secondaryButtonText: string,
    private readonly aController: ModalController | FakeModalController,
    private readonly translate: TranslateService | FakeTranslateService
  ) {}

  async show() {
    this._modal = await this.aController.create(this._modalConfig());
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
      text: this._translate(this.text),
      primaryButtonText: this._translate(this.primaryButtonText),
      secondaryButtonText: this._translate(this.secondaryButtonText),
      token: this.aToken,
    };
  }

  private _translate(aTranslateText: string) {
    return this.translate.instant(aTranslateText, this._tokenSymbol());
  }

  private _tokenSymbol() {
    return { token: this.aToken.symbol() };
  }
}

fdescribe('BalanceModal', () => {
  let balanceModal: BalanceModal;

  beforeEach(() => {
    balanceModal = new BalanceModal(
      new DefaultToken(rawMATICData),
      'text',
      'primaryButtonText',
      'secondaryButtonText',
      new FakeModalController(),
      new FakeTranslateService()
    );
  });

  it('new', () => {
    expect(balanceModal).toBeTruthy();
  });

  it('show', async () => {
    await expectAsync(balanceModal.show()).toBeResolved();
  });

  it('onDidDismisss', async () => {
    await expectAsync(balanceModal.onDidDismiss()).toBeResolved();
  });
});
