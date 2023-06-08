import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken} from 'src/app/modules/swaps/shared-swaps/models/token/token';
import BalanceModal from './balance-modal';

class FakeModalController {
  create(): Promise<any> {
    return Promise.resolve({ present: () => Promise.resolve() , onDidDismiss:() => ({ role: 'closed', data: 'aData'})});
  }
}
class FakeTranslateService {
  instant(aTextToTranslate: string, aParams: Object): string {
    return 'translatedText';
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
    await balanceModal.show();
    expect((await balanceModal.onDidDismiss()).role).toEqual('closed');
  });
});
