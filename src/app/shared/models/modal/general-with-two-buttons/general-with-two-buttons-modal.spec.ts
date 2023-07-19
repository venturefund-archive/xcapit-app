import { FakeModalController } from '../../modal-controller/fake/fake-modal-controller';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { Modal } from '../modal.interface';
import { FakeLocation } from '../../location/fake/fake-location';
import { GeneralWithTwoButtonsModal } from './general-with-two-buttons-modal';

describe('GeneralWithTwoButtonsModal', () => {
  let generalWithTwoButtonsModal: Modal;

  beforeEach(() => {
    generalWithTwoButtonsModal = new GeneralWithTwoButtonsModal(
      null,
      'aHighlightedHeader',
      'aHeaderKey',
      'anInformationKey',
      'aLink',
      'aFirstButtonKey',
      'anEventFirstButton',
      'aUrlFirstButton',
      'aSecondButtonKey',
      'anEventSecondButton',
      'aUrlSecondButton',
      false,
      new FakeModalController(),
      new FakeTranslateService(),
      new FakeLocation('/path/to/url')
    );
  });

  it('new', () => {
    expect(generalWithTwoButtonsModal).toBeTruthy();
  });

  it('show', async () => {
    await expectAsync(generalWithTwoButtonsModal.show()).toBeResolved();
  });

  it('show with custom config', async () => {
    await expectAsync(generalWithTwoButtonsModal.show({ cssClass: 'some-css-class' })).toBeResolved();
  });

  it('show in', async () => {
    await expectAsync(generalWithTwoButtonsModal.showIn('/path/to/url')).toBeResolved();
  });

  it('show in with different url', async () => {
    await expectAsync(generalWithTwoButtonsModal.showIn('/path/to/wrong/url')).toBeResolved();
  });

  it('onDidDismiss', async () => {
    await generalWithTwoButtonsModal.show();
    expect((await generalWithTwoButtonsModal.onDidDismiss()).role).toEqual('closed');
  });
});
