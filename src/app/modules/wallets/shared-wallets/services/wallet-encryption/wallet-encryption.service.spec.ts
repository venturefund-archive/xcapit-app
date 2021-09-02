import { TestBed } from '@angular/core/testing';
import { Wallet } from 'ethers';
import { WalletService } from '../wallet/wallet.service';
import { WalletEncryptionService } from './wallet-encryption.service';
import { StorageService } from '../../services/storage-wallets/storage-wallets.service';
import { Coin } from '../../interfaces/coin.interface';

const wallet = {
  address: 'testAddress',
  mnemonic: {
    path: "m/44'/60'/0'/0/0",
  },
};

const encWallet = {
  enc_wallet: 'enc_wallet',
};

const testCoins: Coin[] = [
  {
    id: 1,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ETH',
    rpc: 'http://testrpc.test',
  },
  {
    id: 2,
    name: 'coinTest2',
    logoRoute: '../../assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'USD',
    rpc: 'http://testrpc.test',
  },
];

const testCoinsStructure = {
  ETH: true,
  USDT: true,
};

const testWallet: Wallet = wallet as Wallet;
testWallet.encrypt = jasmine.createSpy().and.returnValue(Promise.resolve(encWallet));
const testCreatedWallets: Wallet[] = [testWallet];

describe('WalletEncryptionService', () => {
  let service: WalletEncryptionService;
  let storageSpy: any;
  let walletService: WalletService;
  let storageService: StorageService;
  let walletServiceMock;

  storageSpy = jasmine.createSpyObj('StorageService', ['saveWalletToStorage', 'getWalletFromStorage']);

  beforeEach(() => {
    walletServiceMock = {
      wallets: testCreatedWallets,
      coins: testCoins,
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: WalletService, useValue: walletServiceMock },
      ],
    });
    service = TestBed.inject(WalletEncryptionService);
    walletService = TestBed.inject(WalletService);
    storageService = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be encrypt ETH wallet from array', async () => {
    walletService.createdWallets = testCreatedWallets;
    const res = await service.encryptWallet('testPassword');

    expect(res).toEqual(true);
    expect(storageSpy.saveWalletToStorage).toHaveBeenCalled();
  });

  it('should be return true if wallet exist when encryptedWalletExist', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(encWallet);

    const walletExist = await service.encryptedWalletExist();

    expect(walletExist).toEqual(true);
  });

  it('should be return false if wallet doesnt exist when encryptedWalletExist', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(undefined);

    const walletExist = await service.encryptedWalletExist();

    expect(walletExist).toEqual(false);
  });

  it('should be return the selected coins structure by the user when selectedAssetsStructure', () => {
    service.coins = testCoins;
    const selectedAssets = service.selectedAssetsStructure();

    expect(selectedAssets).toEqual(testCoinsStructure);
  });

  it('should be return the wallet from localstorage when getEncryptedWallet', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(encWallet);

    const resWallet = await service.getEncryptedWallet();

    expect(resWallet).toEqual(encWallet);
  });
});
