import { ModalController } from '@ionic/angular/providers/modal-controller';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken, Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import {
  BuyOrDepositTokenToastComponent
} from '../../../modules/fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { TranslateService } from '@ngx-translate/core';

class FakeModalController {}
class FakeTranslateService {}

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
    const modal = await this.aController.create({
      component: BuyOrDepositTokenToastComponent,
      cssClass: 'ux-toast-warning-with-margin',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: {
        text: this.translate.instant(this.text, { token: this.aToken.symbol() }),
        primaryButtonText: this.translate.instant(this.primaryButtonText, { token: this.aToken.symbol() }),
        secondaryButtonText: this.translate.instant(this.secondaryButtonText, { token: this.aToken.symbol() }),
        token: this.aToken,
      },
    })
    return Promise.resolve()
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
