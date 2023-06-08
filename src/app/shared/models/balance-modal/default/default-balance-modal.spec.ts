import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import DefaultBalanceModal from './default-balance-modal';
import { BalanceModal } from '../balance-modal.interface';

class FakeModalController {
  create(): Promise<any> {
    return Promise.resolve({
      present: () => Promise.resolve(),
      onDidDismiss: () => ({ role: 'closed', data: 'aData' }),
    });
  }
}
class FakeTranslateService {
  instant(aTextToTranslate: string, aParams: Object): string {
    return 'translatedText';
  }
}

fdescribe('DefaultBalanceModal', () => {
  let defaultBalanceModal: BalanceModal;

  beforeEach(() => {
    defaultBalanceModal = new DefaultBalanceModal(
      new DefaultToken(rawMATICData),
      'text',
      'primaryButtonText',
      'secondaryButtonText',
      new FakeModalController(),
      new FakeTranslateService()
    );
  });

  it('new', () => {
    expect(defaultBalanceModal).toBeTruthy();
  });

  it('show', async () => {
    await expectAsync(defaultBalanceModal.show()).toBeResolved();
  });

  it('onDidDismisss', async () => {
    await defaultBalanceModal.show();
    expect((await defaultBalanceModal.onDidDismiss()).role).toEqual('closed');
  });
});
