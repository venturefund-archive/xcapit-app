import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { BalanceModal } from './balance-modal';
import { FakeModalController } from '../../modal-controller/fake/fake-modal-controller';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { Modal } from '../modal.interface';
import { FakeLocation } from '../../location/fake/fake-location';

describe('BalanceModal', () => {
  let balanceModal: Modal;

  beforeEach(() => {
    balanceModal = new BalanceModal(
      new DefaultToken(rawMATICData),
      'text',
      'primaryButtonText',
      'secondaryButtonText',
      new FakeModalController(),
      new FakeTranslateService(),
      new FakeLocation('/path/to/url')
    );
  });

  it('new', () => {
    expect(balanceModal).toBeTruthy();
  });

  it('show', async () => {
    await expectAsync(balanceModal.show()).toBeResolved();
  });

  it('show with custom config', async () => {
    await expectAsync(balanceModal.show({ cssClass: 'some-css-class' })).toBeResolved();
  });

  it('show in', async () => {
    await expectAsync(balanceModal.showIn('/path/to/url')).toBeResolved();
  });

  it('show in with different url', async () => {
    await expectAsync(balanceModal.showIn('/path/to/wrong/url')).toBeResolved();
  });

  it('onDidDismiss', async () => {
    await balanceModal.show();
    expect((await balanceModal.onDidDismiss()).role).toEqual('closed');
  });
});
