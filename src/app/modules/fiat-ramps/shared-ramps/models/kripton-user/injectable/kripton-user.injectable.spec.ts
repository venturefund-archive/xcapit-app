import { KriptonUserInjectable } from './kripton-user.injectable';
import { KriptonStorageService } from '../../../services/kripton-storage/kripton-storage.service';
import { KriptonUser } from '../kripton-user';

describe('KriptonUserInjectable', () => {
  let kriptonUserInjectable: KriptonUserInjectable;
  let storageSpy: jasmine.SpyObj<KriptonStorageService>;

  beforeEach(() => {
    kriptonUserInjectable = new KriptonUserInjectable(storageSpy);
  });

  it('new', () => {
    expect(kriptonUserInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(kriptonUserInjectable.create()).toBeInstanceOf(KriptonUser);
  });
});
