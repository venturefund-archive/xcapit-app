import { ModalController } from '@ionic/angular/providers/modal-controller';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken, Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';

class FakeModalController {}

export default class BalanceModal {
  constructor(
    private readonly aToken: Token,
    private readonly text: string,
    private readonly primaryButtonText: string,
    private readonly secondaryButtonText: string,
    private readonly aController: ModalController | FakeModalController
  ) {}

  show(){
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
      new FakeModalController()
    );
  });

  it('new', () => {
    expect(balanceModal).toBeTruthy();
  });

  it('show', async () => {
    await expectAsync(balanceModal.show()).toBeResolved();
  });
});
