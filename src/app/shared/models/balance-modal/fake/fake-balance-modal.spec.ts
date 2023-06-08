import { BalanceModal } from '../balance-modal.interface';
import { FakeBalanceModal } from './fake-balance-modal';

fdescribe('FakeBalanceModal', () => {
  let fakeBalanceModal: BalanceModal;

  beforeEach(() => {
    fakeBalanceModal = new FakeBalanceModal();
  });

  it('new', () => {
    expect(fakeBalanceModal).toBeTruthy();
  });
  it('show', async () => {
    await expectAsync(fakeBalanceModal.show()).toBeResolved();
  });

  it('onDidDismiss', async () => {
    expect((await fakeBalanceModal.onDidDismiss()).role).toEqual('closed');
  });
});
