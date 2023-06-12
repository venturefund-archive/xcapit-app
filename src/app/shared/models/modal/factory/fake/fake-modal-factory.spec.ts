import { ModalFactory } from '../modal-factory.interface';
import { FakeModal } from '../../fake/fake-modal';
import { FakeModalFactory } from './fake-modal-factory';
import { Modals } from '../default/default-modal-factory';

describe('FakeModalFactory', () => {
  let fakeModalFactory: ModalFactory;

  beforeEach(() => {
    fakeModalFactory = new FakeModalFactory(new FakeModal());
  });

  it('new', () => {
    expect(fakeModalFactory).toBeTruthy();
  });

  it('oneBy', () => {
    expect(fakeModalFactory.oneBy(Modals.BALANCE, [])).toEqual(new FakeModal());
  });
});
