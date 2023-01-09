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
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { StorageWallet } from '../../interfaces/storage-wallet.interface';
import { StorageAsset } from '../../interfaces/storage-asset.interface';
import { Mnemonic } from 'ethers/lib/utils';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

describe('WalletMaintenanceService', () => {
  let service: WalletMaintenanceService;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let ethersServiceSpy: jasmine.SpyObj<EthersService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let walletsFactorySpy: jasmine.SpyObj<any | WalletsFactory>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  const testMnemonic: Mnemonic = {
    locale: 'en',
    phrase: 'test mnemonic constant',
    path: '',
  };

  const testToggleAssets = [
    { value: 'ETH', network: 'ERC20' },
    { value: 'RBTC', network: 'RSK' },
    { value: 'RSK', network: 'RSK' },
  ];

  const walletResultToggleAssets: StorageWallet = {
    alias: 'test',
    createdAt: '11-11-11',
    updatedAt: '11-11-11',
    network: 'testnet',
    addresses: {
      ERC20: 'testAddress',
      RSK: 'testAddress',
    },
    assets: [
      { value: 'USDT', network: 'ERC20' },
      { value: 'RBTC', network: 'RSK' },
      { value: 'RSK', network: 'RSK' },
    ],
  };

  const testEncryptedWallet: StorageWallet = {
    alias: 'test',
    createdAt: '11-11-11',
    updatedAt: '11-11-11',
    network: 'testnet',
    addresses: {
      ERC20: 'testAddress',
      RSK: 'testAddress',
    },
    assets: [
      { value: 'ETH', network: 'ERC20' },
      { value: 'USDT', network: 'ERC20' },
    ],
  };

  const testOldEncryptedWallet = {
    alias: 'test',
    createdAt: '11-11-11',
    updatedAt: '11-11-11',
    network: 'testnet',
    addresses: {
      ERC20: 'testAddress',
      RSK: 'testAddress',
    },
    assets: { ETH: true, DAI: false, USDT: true },
  };

  const updateResultWallet: StorageWallet = {
    alias: 'test',
    createdAt: '11-11-11',
    updatedAt: moment('2015-10-19').utc().format(),
    network: 'testnet',
    addresses: {
      ERC20: 'testAddress',
      RSK: 'testAddress',
      MATIC: 'testAddress',
    },
    assets: [
      { value: 'USDT', network: 'ERC20' },
      { value: 'RBTC', network: 'RSK' },
      { value: 'RSK', network: 'RSK' },
    ],
  };

  const testCoins: Coin[] = [
    {
      id: 1,
      name: 'ETH - Ethereum',
      logoRoute: 'assets/img/coins/ETH.svg',
      value: 'ETH',
      network: 'ERC20',
      chainId: 42,
      rpc: 'http://testrpc.test/',
      native: true,
    },
    {
      id: 3,
      name: 'USDT - Tether',
      logoRoute: 'assets/img/coins/USDT.svg',
      value: 'USDT',
      network: 'ERC20',
      chainId: 42,
      rpc: 'http://testrpc.test/',
      decimals: 6,
    },
    {
      id: 6,
      name: 'RBTC - Smart Bitcoin',
      logoRoute: 'assets/img/coins/RBTC.png',
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
      value: 'MATIC',
      network: 'MATIC',
      chainId: 80001,
      rpc: 'http://testrpc.text/',
      decimals: 18,
      native: true,
    },
    {
      id: 26,
      name: 'DAI - DAI',
      logoRoute: 'assets/img/coins/DAI.png',
      value: 'DAI',
      network: 'MATIC',
      chainId: 80001,
      rpc: 'http://testrpc.text/',
      decimals: 18,
      symbol: 'USDTDAI',
      canInvest: true,
    },
  ];

  beforeEach(() => {
    walletMnemonicServiceSpy = jasmine.createSpyObj(
      'WalletMnemonicService',
      {
        getMnemonic: testMnemonic,
      },
      {
        mnemonic: testMnemonic,
      }
    );
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
      getAssetsSelected: Promise.resolve([testCoins[0]]),
    });
    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      createForDerivedPath: { address: 'testResultAddress' },
    });
    ethersServiceSpy = jasmine.createSpyObj('EthersService', {
      decryptWalletJsonSync: {},
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)),
    });
    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: jasmine.createSpyObj('Wallets', {
        oneBy: Promise.resolve({ address: () => 'testAddress' }),
        createFrom: Promise.resolve(),
      }),
    });
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
      set: Promise.resolve(),
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
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
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
    service.encryptedWallet = jasmine.createSpyObj('Wallet', {}, { addresses: {} });
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
    service.encryptedWallet = jasmine.createSpyObj('Wallet', {}, walletResultToggleAssets);
    await service.saveWalletToStorage();
    expect(storageServiceSpy.saveWalletToStorage).toHaveBeenCalledOnceWith(walletResultToggleAssets);
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
    expect(storageServiceSpy.getAssetsSelected).toHaveBeenCalledTimes(1);
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
    const addCoinLocallySpy = spyOn(service, 'addCoinLocally');
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    await service.addCoinIfUserDoesNotHaveIt(TEST_COINS[2]);
    expect(getWalletSpy).not.toHaveBeenCalled();
    expect(addCoinLocallySpy).not.toHaveBeenCalled();
    expect(saveWalletSpy).not.toHaveBeenCalled();
    expect(service.encryptedWallet).toBeUndefined();
  });

  it('should get wallet and not add coin to wallet if wallet is undefined and user has the coin on addCoinIfUserDoesNotHaveIt', async () => {
    const saveWalletSpy = spyOn(service, 'saveWalletToStorage').and.callThrough();
    const getWalletSpy = spyOn(service, 'getEncryptedWalletFromStorage').and.callThrough();
    const addCoinLocallySpy = spyOn(service, 'addCoinLocally');
    await service.addCoinIfUserDoesNotHaveIt(TEST_COINS[2]);
    expect(getWalletSpy).toHaveBeenCalledTimes(1);
    expect(addCoinLocallySpy).not.toHaveBeenCalled();
    expect(saveWalletSpy).not.toHaveBeenCalled();
    expect(service.encryptedWallet).toBeUndefined();
  });

  it('should not get wallet and add coin to wallet if wallet is already getted and user does not have coin on addCoinIfUserDoesNotHaveIt', async () => {
    const saveWalletSpy = spyOn(service, 'saveWalletToStorage').and.callThrough();
    const getWalletSpy = spyOn(service, 'getEncryptedWalletFromStorage').and.callThrough();
    const addCoinLocallySpy = spyOn(service, 'addCoinLocally');
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    await service.addCoinIfUserDoesNotHaveIt(TEST_COINS[4]);
    expect(getWalletSpy).not.toHaveBeenCalled();
    expect(addCoinLocallySpy).toHaveBeenCalledOnceWith(TEST_COINS[4]);
    expect(saveWalletSpy).toHaveBeenCalledTimes(1);
    expect(service.encryptedWallet).toBeUndefined();
  });

  it('should get wallet and add coin to wallet if wallet is undefined and user does not have coin on addCoinIfUserDoesNotHaveIt', async () => {
    const saveWalletSpy = spyOn(service, 'saveWalletToStorage').and.callThrough();
    const getWalletSpy = spyOn(service, 'getEncryptedWalletFromStorage').and.callThrough();
    const addCoinLocallySpy = spyOn(service, 'addCoinLocally');
    await service.addCoinIfUserDoesNotHaveIt(TEST_COINS[4]);
    expect(getWalletSpy).toHaveBeenCalledTimes(1);
    expect(addCoinLocallySpy).toHaveBeenCalledOnceWith(TEST_COINS[4]);
    expect(saveWalletSpy).toHaveBeenCalledTimes(1);
    expect(service.encryptedWallet).toBeUndefined();
  });

  it('should save wallet assets on updateTokensStorage', async () => {
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    const testTokens: StorageAsset[] = [
      { value: 'ETH', network: 'ERC20' },
      { value: 'BNB', network: 'BSC_BEP20' },
      { value: 'MATIC', network: 'MATIC' },
    ];
    
    const testWallet: StorageWallet = {
      alias: 'test',
      createdAt: '11-11-11',
      updatedAt: '11-11-11',
      network: 'testnet',
      addresses: {
        ERC20: 'testAddress',
        RSK: 'testAddress',
      },
      assets: testTokens,
    };
    walletEncryptionServiceSpy.getEncryptedWallet.and.resolveTo(testWallet);
    await service.updateTokensStorage(testTokens);
    expect(storageServiceSpy.saveWalletToStorage).toHaveBeenCalledOnceWith(testWallet);
  });
  
  it('should migrate tokens structure if user has a wallet with old structure', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(false);
    service.encryptedWallet = JSON.parse(JSON.stringify(testOldEncryptedWallet));
    walletEncryptionServiceSpy.getEncryptedWallet.and.resolveTo(testOldEncryptedWallet);
    await service.checkTokensStructure();
    expect(storageServiceSpy.saveWalletToStorage).toHaveBeenCalledOnceWith(testEncryptedWallet);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('tokens_structure_migrated',true);
  });
  
  it('should not migrate tokens structure if already was migrated', async () => {
    await service.checkTokensStructure();
    expect(storageServiceSpy.saveWalletToStorage).toHaveBeenCalledTimes(0);
    expect(ionicStorageServiceSpy.get).toHaveBeenCalledOnceWith('tokens_structure_migrated');
  });
  
  it('should not migrate tokens structure if is a new wallet', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(false);
    service.encryptedWallet = JSON.parse(JSON.stringify(testEncryptedWallet));
    walletEncryptionServiceSpy.getEncryptedWallet.and.resolveTo(testEncryptedWallet);
    await service.checkTokensStructure();
    expect(storageServiceSpy.saveWalletToStorage).toHaveBeenCalledTimes(0);
    expect(ionicStorageServiceSpy.get).toHaveBeenCalledOnceWith('tokens_structure_migrated');
  });
});
