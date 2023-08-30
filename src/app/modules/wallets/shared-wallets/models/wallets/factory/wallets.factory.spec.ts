import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { Wallets } from '../wallets';
import { WalletsFactory } from './wallets.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { rawStoredWalletData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-stored-wallet-data';

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
