import { Storage } from '@ionic/storage-angular';
import { storageInitializer } from './storage-initializer';

describe('storageInitializer', () => {
  let storageInitializerSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    storageInitializerSpy = jasmine.createSpyObj('Storage', { create: null });
  });

  it('should translate setDefaultLang be called with es', () => {
    storageInitializer(storageInitializerSpy)();
    expect(storageInitializerSpy.create).toHaveBeenCalledTimes(1);
  });

});
