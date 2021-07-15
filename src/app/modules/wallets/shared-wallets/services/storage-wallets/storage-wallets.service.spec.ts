import { TestBed } from '@angular/core/testing';

import { StorageWalletsService } from './storage-wallets.service';
import { Storage } from '@ionic/storage';

describe('StorageWalletsService', () => {
  let service: StorageWalletsService;
  let storageSpy: any;
  storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storageSpy }],
    });
    service = TestBed.inject(StorageWalletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
