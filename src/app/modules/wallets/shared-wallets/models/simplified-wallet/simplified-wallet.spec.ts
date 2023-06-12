import { IonicStorageService } from '../../../../../shared/services/ionic-storage/ionic-storage.service';
import { SimplifiedWallet } from './simplified-wallet';

describe('SimplifiedWallet', () => {
  let simplifiedWallet: SimplifiedWallet;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  const aValue = true;
  const storageKey = 'aStorageKey';
  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(aValue),
      set: Promise.resolve(),
    });
    simplifiedWallet = new SimplifiedWallet(storageSpy, storageKey);
  });

  it('new', () => {
    expect(simplifiedWallet).toBeTruthy();
  });

  it('save', async () => {
    await simplifiedWallet.save(aValue);
    expect(storageSpy.set).toHaveBeenCalledOnceWith(storageKey, aValue);
  });

  it('value', async () => {
    expect(await simplifiedWallet.value()).toBeTrue();
  });
});
