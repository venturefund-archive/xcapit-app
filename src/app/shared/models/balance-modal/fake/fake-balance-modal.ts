import { BalanceModal } from '../balance-modal.interface';

export class FakeBalanceModal implements BalanceModal {
  show(): Promise<void> {
    return Promise.resolve();
  }
  onDidDismiss(): Promise<any> {
    return Promise.resolve({ role: 'closed' });
  }
}
