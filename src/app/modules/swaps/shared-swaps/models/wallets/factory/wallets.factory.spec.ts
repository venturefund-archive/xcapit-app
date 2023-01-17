import { AppStorageService, FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { BlockchainsFactory } from '../../blockchains/factory/blockchains.factory';
import { rawBlockchainsData } from '../../fixtures/raw-blockchains-data';
import { rawStoredWalletData } from '../../fixtures/raw-stored-wallet-data';
import { Wallets } from '../wallets';
import { WalletsFactory } from './wallets.factory';

describe('Wallets Factory', () => {
  let walletsFactory: WalletsFactory;
  let storageSpy: jasmine.SpyObj<AppStorageService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>; 

  beforeEach(() => {
    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: {}, 
    })
    storageSpy = jasmine.createSpyObj('AppStorageSpy', {
      get: rawStoredWalletData,
    });
    walletsFactory = new WalletsFactory(
      storageSpy,
      blockchainsFactorySpy
    );
  });

  it('new', () => {
    expect(walletsFactory).toBeTruthy();
  });

  it('create', () => {
    expect(walletsFactory.create()).toBeInstanceOf(Wallets);
    expect(blockchainsFactorySpy.create).toHaveBeenCalled();
  });
});
