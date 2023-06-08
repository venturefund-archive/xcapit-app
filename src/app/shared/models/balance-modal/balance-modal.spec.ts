import { ModalController } from '@ionic/angular/providers/modal-controller';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken, Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { BuyOrDepositTokenToastComponent } from '../../../modules/fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(
    private readonly aToken: Token,
    private readonly text: string,
    private readonly primaryButtonText: string,
    private readonly secondaryButtonText: string,
    private readonly aController: ModalController | FakeModalController,
    private readonly translate: TranslateService | FakeTranslateService
  ) {}

  async show() {
    const modal = await this.aController.create(this._modalConfig());
    await modal.present();
  }

  private _tokenSymbol() {
    return { token: this.aToken.symbol() };
  }

  private _translate(aTranslateText: string){
    return this.translate.instant(aTranslateText, this._tokenSymbol());
  }
  
  private _props() {
    return {
      text: this._translate(this.text),
      primaryButtonText: this._translate(this.primaryButtonText),
      secondaryButtonText: this._translate(this.secondaryButtonText),
      token: this.aToken,
    };
  }

  private _modalConfig() {
    return {
      component: BuyOrDepositTokenToastComponent,
      cssClass: 'ux-toast-warning-with-margin',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: this._props(),
    };
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
});
