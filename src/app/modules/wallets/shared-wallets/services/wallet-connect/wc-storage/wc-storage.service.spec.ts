import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WCStorageService } from './wc-storage.service';
import { TestBed } from '@angular/core/testing';

describe('WCStorageService', () => {
  let service: WCStorageService;
  let ionicStorageSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    ionicStorageSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve('137'),
      remove: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: IonicStorageService, useValue: ionicStorageSpy }],
    });
    service = TestBed.inject(WCStorageService);
  });

  it('new', () => {
    expect(service).toBeTruthy();
  });

  it('set', async () => {
    await service.set('proposal_wallet_chain_id', '137');
    expect(ionicStorageSpy.set).toHaveBeenCalledOnceWith('wc_proposal_wallet_chain_id', '137');
  });

  it('get', async () => {
    const chainId = await service.get('proposal_wallet_chain_id');

    expect(chainId).toEqual('137');
    expect(ionicStorageSpy.get).toHaveBeenCalledOnceWith('wc_proposal_wallet_chain_id');
  });

  it('remove', async () => {
    await service.remove('current_proposal');
    expect(ionicStorageSpy.remove).toHaveBeenCalledOnceWith('wc_current_proposal');
  });
});
