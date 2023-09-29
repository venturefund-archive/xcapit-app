import { Storage } from '@ionic/storage-angular';

export function storageInitializer(storage: Storage) {
  return () => {
    return storage.create();
  };
}
