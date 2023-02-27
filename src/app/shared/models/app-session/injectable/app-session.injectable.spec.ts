import { TestBed, waitForAsync } from '@angular/core/testing';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { AppSession } from '../app-session';
import { AppSessionInjectable } from './app-session.injectable';

describe('AppSessionInjectable', () => {
  let injectable: AppSessionInjectable;
  let walletStorageServiceSpy: jasmine.SpyObj<StorageService>;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: walletStorageServiceSpy },
        { provide: IonicStorageService, useValue: storageSpy },
      ]
    });
    injectable = TestBed.inject(AppSessionInjectable);
  }));

  it('should create', () => {
    expect(injectable).toBeTruthy();
  });

  it('create', () => {
    expect(injectable.create()).toBeInstanceOf(AppSession);
  });
});
