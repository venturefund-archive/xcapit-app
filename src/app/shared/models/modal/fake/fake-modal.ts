import { Modal } from '../modal.interface';

export class FakeModal implements Modal {
  public calls = 0;

  show(config = {}): Promise<void> {
    this.calls++;
    return Promise.resolve();
  }

  async showIn(url: string, config = {}): Promise<void> {
    await this.show();
  }

  onDidDismiss(): Promise<any> {
    return Promise.resolve({ role: 'closed' });
  }
}
