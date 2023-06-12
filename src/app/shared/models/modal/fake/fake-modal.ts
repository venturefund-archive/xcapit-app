import { Modal } from "../modal.interface";

export class FakeModal implements Modal {
  public calls = 0;

  show(config = {}): Promise<void> {
    this.calls++;
    return Promise.resolve();
  }
  onDidDismiss(): Promise<any> {
    return Promise.resolve({ role: 'closed' });
  }
}
