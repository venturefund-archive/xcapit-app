import { BalanceModal } from '../balance-modal.interface';

export class FakeBalanceModal implements BalanceModal {
  show(): Promise<void> {
    return Promise.resolve();
  }
  onDidDismiss(): Promise<any> {
    return Promise.resolve({ role: 'closed' });
  }
}

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

  it('onDidDismiss', () => {
    expect((await fakeBalanceModal.onDidDismiss()).role).toEqual('closed');
  });
});
