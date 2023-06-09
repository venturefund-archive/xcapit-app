import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import DefaultBalanceModal from './default-balance-modal';
import { BalanceModal } from '../balance-modal.interface';
import { FakeModalController } from '../../modal-controller/fake/fake-modal-controller';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';

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

  it('onDidDismiss', async () => {
    await defaultBalanceModal.show();
    expect((await defaultBalanceModal.onDidDismiss()).role).toEqual('closed');
  });
});
