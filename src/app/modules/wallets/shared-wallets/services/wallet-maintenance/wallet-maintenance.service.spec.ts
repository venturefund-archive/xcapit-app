import { TestBed } from '@angular/core/testing';
import { WalletMaintenanceService } from './wallet-maintenance.service';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from '../wallet/wallet.service';
import { Coin } from '../../interfaces/coin.interface';
import { EthersService } from '../ethers/ethers.service';
import moment from 'moment';
import { TEST_COINS } from '../../constants/coins.test';

const testMnemonic = {
  locale: 'en',
  phrase: 'test mnemonic constant',
  path: '',
};

const testToggleAssets = ['USDT', 'RBTC', 'RSK'];

const walletResultToggleAssets = {
  addresses: {
    ERC20: 'testAddress',
    RSK: 'testAddress',
  },
  assets: {
    ETH: true,
    USDT: false,
    RBTC: true,
    RSK: true,
  },
};

const testEncryptedWallet = {
  addresses: {
    ERC20: 'testAddress',
    RSK: 'testAddress',
  },
  assets: {
    ETH: true,
    USDT: true,
    RBTC: false,
    RSK: false,
  },
};

const updateResultWallet = {
  addresses: {
    ERC20: 'testAddress',
    RSK: 'testAddress',
    MATIC: 'testResultAddress',
  },
  updatedAt: moment('2015-10-19').utc().format(),
  assets: {
    ETH: true,
    USDT: false,
    RBTC: true,
    RSK: true,
    MATIC: false,
  },
};

const testCoins: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'testRpc',
    native: true,
  },
  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.svg',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

fdescribe('WalletMaintenanceService', () => {
  let service: WalletMaintenanceService;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let ethersServiceSpy: jasmine.SpyObj<EthersService>;

  beforeEach(() => {
    walletMnemonicServiceSpy = jasmine.createSpyObj('WalletMnemonicService', {
      getMnemonic: testMnemonic,
    });
    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getEncryptedWallet: Promise.resolve(JSON.parse(JSON.stringify(testEncryptedWallet))),
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getWalletNewNetworks: ['ERC20'],
      getCoinsFromNetwork: [testCoins[2]],
      getCoins: testCoins,
    });
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      saveWalletToStorage: Promise.resolve(),
    });
    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      createForDerivedPath: { address: 'testResultAddress' },
    });
    ethersServiceSpy = jasmine.createSpyObj('EthersService', {
      decryptWalletJsonSync: {},
    });
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: EthersService, useValue: ethersServiceSpy },
      ],
    });
    service = TestBed.inject(WalletMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getEncryptedWallet on getEncryptedWalletFromStorage', async () => {
    await service.getEncryptedWalletFromStorage();
    expect(walletEncryptionServiceSpy.getEncryptedWallet).toHaveBeenCalledTimes(1);
    expect(service.encryptedWallet).toEqual(testEncryptedWallet);
  });

  it('should call getWalletNewNetworks and set newNetworks on getNewNetworks', () => {
    service.encryptedWallet = {};
    service.getNewNetworks();
    expect(apiWalletServiceSpy.getWalletNewNetworks).toHaveBeenCalledTimes(1);
    expect(service.newNetworks).toEqual(['ERC20']);
  });

  it('should return false if there are new networks on isUpdated', () => {
    const isUpdated = service.isUpdated();
    expect(isUpdated).toBeFalse();
  });

  it('should return true if no new networks have been added on isUpdated', () => {
    apiWalletServiceSpy.getWalletNewNetworks.and.returnValue([]);
    const isUpdated = service.isUpdated();
    expect(isUpdated).toBeTrue();
  });

  it('should save wallet with update date and reset values on saveWalletToStorage', async () => {
    service.encryptedWallet = { test: 'test' };
    await service.saveWalletToStorage();
    expect(storageServiceSpy.saveWalletToStorage).toHaveBeenCalledOnceWith({ test: 'test' });
    expect(service.encryptedWallet).toBeUndefined();
    expect(service.newNetworks).toBeUndefined();
    expect(service.password).toBeUndefined();
  });

  it('should change assets in wallet that are selected on toggleAssets', () => {
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    service.toggleAssets(testToggleAssets);
    expect(service.encryptedWallet).toEqual(walletResultToggleAssets);
  });

  it('should get wallet assets from local storage on getUserAssests', async () => {
    const coins = await service.getUserAssets();
    expect(coins).toEqual([testCoins[0]]);
    expect(walletEncryptionServiceSpy.getEncryptedWallet).toHaveBeenCalledTimes(1);
    expect(service.encryptedWallet).toEqual(testEncryptedWallet);
  });

  it('should create new wallet addresses on updateWalletNetworks', async () => {
    const today = moment('2015-10-19').toDate();
    jasmine.clock().mockDate(today);
    service.newNetworks = ['MATIC'];
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    await service.updateWalletNetworks(testToggleAssets);
    expect(service.encryptedWallet).toEqual(updateResultWallet);
  });

  it('should create new wallet addresses and set new tokens on updateWalletNetworks', async () => {
    const today = moment('2015-10-19').toDate();
    jasmine.clock().mockDate(today);
    service.newNetworks = ['MATIC'];
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    const toggleAssets = JSON.parse(JSON.stringify(testToggleAssets));
    toggleAssets.push('MATIC');
    const expectedResult = JSON.parse(JSON.stringify(updateResultWallet));
    expectedResult.assets.MATIC = true;
    await service.updateWalletNetworks(toggleAssets);
    expect(service.encryptedWallet).toEqual(expectedResult);
  });

  it('should return true if user has coin on userHasCoin', () => {
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    const hasCoin = service.userHasCoin(TEST_COINS[2]);
    expect(hasCoin).toBeTrue();
  });

  it('should return false if user has not coin on userHasCoin', () => {
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    const hasCoin = service.userHasCoin(TEST_COINS[4]);
    expect(hasCoin).toBeFalse();
  });

  it('should not get wallet and not add coin to wallet if wallet is already getted and user has the coin on addCoinIfUserDoesNotHaveIt', async () => {
    const saveWalletSpy = spyOn(service, 'saveWalletToStorage').and.callThrough();
    const getWalletSpy = spyOn(service, 'getEncryptedWalletFromStorage').and.callThrough();
    const toggleAssetsSpy = spyOn(service, 'toggleAssets');
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    await service.addCoinIfUserDoesNotHaveIt(TEST_COINS[2]);
    expect(getWalletSpy).not.toHaveBeenCalled();
    expect(toggleAssetsSpy).not.toHaveBeenCalledWith([TEST_COINS[2].value]);
    expect(saveWalletSpy).not.toHaveBeenCalled();
    expect(service.encryptedWallet).toBeUndefined();
  });

  it('should get wallet and not add coin to wallet if wallet is undefined and user has the coin on addCoinIfUserDoesNotHaveIt', async () => {
    const saveWalletSpy = spyOn(service, 'saveWalletToStorage').and.callThrough();
    const getWalletSpy = spyOn(service, 'getEncryptedWalletFromStorage').and.callThrough();
    const toggleAssetsSpy = spyOn(service, 'toggleAssets');
    await service.addCoinIfUserDoesNotHaveIt(TEST_COINS[2]);
    expect(getWalletSpy).toHaveBeenCalledTimes(1);
    expect(toggleAssetsSpy).not.toHaveBeenCalledWith([TEST_COINS[2].value]);
    expect(saveWalletSpy).not.toHaveBeenCalled();
    expect(service.encryptedWallet).toBeUndefined();
  });

  it('should not get wallet and add coin to wallet if wallet is already getted and user does not have coin on addCoinIfUserDoesNotHaveIt', async () => {
    const saveWalletSpy = spyOn(service, 'saveWalletToStorage').and.callThrough();
    const getWalletSpy = spyOn(service, 'getEncryptedWalletFromStorage').and.callThrough();
    const toggleAssetsSpy = spyOn(service, 'toggleAssets');
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    await service.addCoinIfUserDoesNotHaveIt(TEST_COINS[4]);
    expect(getWalletSpy).not.toHaveBeenCalled();
    expect(toggleAssetsSpy).toHaveBeenCalledOnceWith([TEST_COINS[4].value]);
    expect(saveWalletSpy).toHaveBeenCalledTimes(1);
    expect(service.encryptedWallet).toBeUndefined();
  });

  it('should get wallet and add coin to wallet if wallet is undefined and user does not have coin on addCoinIfUserDoesNotHaveIt', async () => {
    const saveWalletSpy = spyOn(service, 'saveWalletToStorage').and.callThrough();
    const getWalletSpy = spyOn(service, 'getEncryptedWalletFromStorage').and.callThrough();
    const toggleAssetsSpy = spyOn(service, 'toggleAssets');
    await service.addCoinIfUserDoesNotHaveIt(TEST_COINS[4]);
    expect(getWalletSpy).toHaveBeenCalledTimes(1);
    expect(toggleAssetsSpy).toHaveBeenCalledOnceWith([TEST_COINS[4].value]);
    expect(saveWalletSpy).toHaveBeenCalledTimes(1);
    expect(service.encryptedWallet).toBeUndefined();
  });
});
