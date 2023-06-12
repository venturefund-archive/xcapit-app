import { ModalFactory } from '../modal-factory.interface';
import { Modal } from '../../modal.interface';
import { Modals } from '../default/default-modal-factory';

export class FakeModalFactory implements ModalFactory {
  constructor(private createReturn: Modal) {}

  oneBy(modalType: Modals, args: any[]): any {
    return this.createReturn;
  }
}
