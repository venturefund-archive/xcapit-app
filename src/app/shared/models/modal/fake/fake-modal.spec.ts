import { Modal } from '../modal.interface';
import { FakeModal } from './fake-modal';

describe('FakeModal', () => {
  let fakeModal: Modal;

  beforeEach(() => {
    fakeModal = new FakeModal();
  });

  it('new', () => {
    expect(fakeModal).toBeTruthy();
  });

  it('show', async () => {
    await expectAsync(fakeModal.show()).toBeResolved();
  });

  it('showIn', async () => {
    await expectAsync(fakeModal.showIn('anUrl')).toBeResolved();
  });

  it('onDidDismiss', async () => {
    expect((await fakeModal.onDidDismiss()).role).toEqual('closed');
  });
});
