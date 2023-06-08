
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken} from 'src/app/modules/swaps/shared-swaps/models/token/token';

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


fdescribe('DefaultBalanceModal', () => {
  let DefaultBalanceModal: DefaultBalanceModal;

  beforeEach(() => {
    DefaultBalanceModal = new DefaultBalanceModal(
      new DefaultToken(rawMATICData),
      'text',
      'primaryButtonText',
      'secondaryButtonText',
      new FakeModalController(),
      new FakeTranslateService()
    );
  });

  it('new', () => {
    expect(DefaultBalanceModal).toBeTruthy();
  });

  it('show', async () => {
    await expectAsync(DefaultBalanceModal.show()).toBeResolved();
  });

  it('onDidDismisss', async () => {
    await DefaultBalanceModal.show();
    expect((await DefaultBalanceModal.onDidDismiss()).role).toEqual('closed');
  });
});
