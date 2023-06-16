import { Modals } from './default/default-modal-factory';

export interface ModalFactory {
  oneBy: (modalType: Modals, args: any[]) => any;
}
