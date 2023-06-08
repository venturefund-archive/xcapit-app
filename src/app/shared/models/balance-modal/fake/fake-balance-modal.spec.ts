import { BalanceModal } from '../balance-modal.interface';

export class FakeBalanceModal implements BalanceModal {
  onDidDismiss(): Promise<any> {
    return Promise.resolve({ role: 'closed' });
  }

  show(): Promise<void> {
    return Promise.resolve();
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
});
