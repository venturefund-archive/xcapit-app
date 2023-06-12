import { FakeModalController } from '../../modal-controller/fake/fake-modal-controller';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { GeneralWithButtonModal } from './general-with-button-modal';
import { Modal } from '../modal.interface';

describe('GeneralWithButtonModal', () => {
  let generalWithButtonModal: Modal;

  beforeEach(() => {
    generalWithButtonModal = new GeneralWithButtonModal(
      'aTitleKey',
      'aDescriptionKey',
      'aButtonTextKey',
      '/path/to',
      new FakeModalController(),
      new FakeTranslateService()
    );
  });

  it('new', () => {
    expect(generalWithButtonModal).toBeTruthy();
  });

  it('show', async () => {
    await expectAsync(generalWithButtonModal.show()).toBeResolved();
  });

  it('show with custom config', async () => {
    await expectAsync(generalWithButtonModal.show({ cssClass: 'some-css-class' })).toBeResolved();
  });

  it('onDidDismiss', async () => {
    await generalWithButtonModal.show();
    expect((await generalWithButtonModal.onDidDismiss()).role).toEqual('closed');
  });
});
