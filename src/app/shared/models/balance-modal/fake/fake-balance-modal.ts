import { BalanceModal } from '../balance-modal.interface';

export class FakeBalanceModal implements BalanceModal {
  public calls = 0;

  show(config = {}): Promise<void> {
    this.calls++;
    return Promise.resolve();
  }
  onDidDismiss(): Promise<any> {
    return Promise.resolve({ role: 'closed' });
  }
}
