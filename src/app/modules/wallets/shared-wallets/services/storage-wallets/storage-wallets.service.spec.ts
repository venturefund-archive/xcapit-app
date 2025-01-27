import { TestBed } from '@angular/core/testing';
import { StorageWalletsService, StorageService } from './storage-wallets.service';
import { Storage } from '@ionic/storage-angular';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { NONPROD_COINS } from '../../constants/coins.nonprod';

const testCoins: Coin[] = [
  {
    id: 1,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test',
  },
  {
    id: 2,
    name: 'coinTest2',
    logoRoute: '../../assets/img/coins/USDT.svg',
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test',
  },
];

describe('StorageWalletsService', () => {
  let service: StorageWalletsService;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storageSpy }],
    });

    service = TestBed.inject(StorageWalletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save the value in the storage on setValue', async () => {
    await service.setValue('key', 'value');
    expect(storageSpy.set).toHaveBeenCalledWith('key', 'value');
  });

  it('should get the value in the storage on getValue', async () => {
    await service.getValue('value');
    expect(storageSpy.get).toHaveBeenCalledWith('value');
  });

  it('should return true on hasAcceptedToS when userAcceptedToS is true', async () => {
    spyOn(service, 'getValue').and.returnValue(Promise.resolve(true));
    const userAcceptedToS = await service.hasAcceptedToS();
    expect(userAcceptedToS).toBeTrue();
  });

  it('should return false on hasAcceptedToS when userAcceptedToS is undefined', async () => {
    spyOn(service, 'getValue').and.returnValue(Promise.resolve(undefined));
    const userAcceptedToS = await service.hasAcceptedToS();
    expect(userAcceptedToS).toBeFalse();
  });

  it('should set userAcceptedToS to true on acceptToS', async () => {
    const spy = spyOn(service, 'setValue');
    await service.acceptToS();
    expect(spy).toHaveBeenCalledWith('userAcceptedToS', true);
  });
});

describe('StorageService', () => {
  let service: StorageService;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let testWalletStub: jasmine.SpyObj<any>;

  beforeEach(() => {
    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', ['get', 'set', 'remove']);
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: NONPROD_COINS,
    });
    testWalletStub = jasmine.createSpyObj('storageWallet', [], {
      addresses: {
        ETH: 'testAddress',
      },
      assets: [
        { value: 'ETH', network: 'ERC20' },
        { value: 'USDT', network: 'ERC20' },
      ],
      updatedAt: '2021-08-23T18:46:47Z',
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: AppStorageService, useValue: appStorageServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
      ],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save the wallet in the localstorage on saveWalletToStorage', async () => {
    await service.saveWalletToStorage(testWalletStub);
    expect(appStorageServiceSpy.set).toHaveBeenCalledWith('enc_wallet', testWalletStub);
  });

  it('should get the wallet from the localstorage on getWalletFromStorage', async () => {
    await service.getWalletFromStorage();
    expect(appStorageServiceSpy.get).toHaveBeenCalledWith('enc_wallet');
  });

  it('should remove the wallet from the localstorage on removeWalletFromStorage', async () => {
    await service.removeWalletFromStorage();
    expect(appStorageServiceSpy.remove).toHaveBeenCalledWith('enc_wallet');
  });

  it('should return the wallet addresses from localstorage on getWalletsAddresses', async () => {
    spyOn(service, 'getWalletFromStorage').and.returnValue(Promise.resolve(testWalletStub));
    const addresses = await service.getWalletsAddresses();

    expect(addresses).toEqual(testWalletStub.addresses);
  });

  it('should return the selected assets by the user from localstorage on getAssetsSelected', async () => {
    spyOn(service, 'getWalletFromStorage').and.returnValue(Promise.resolve(testWalletStub));
    const assetsSelected = await service.getAssetsSelected();

    expect(assetsSelected[0].value).toEqual(testCoins[0].value);
    expect(assetsSelected[1].value).toEqual(testCoins[1].value);
  });
});
