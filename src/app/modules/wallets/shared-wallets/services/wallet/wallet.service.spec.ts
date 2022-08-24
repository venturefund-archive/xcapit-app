import { TestBed } from '@angular/core/testing';
import { ethers, Wallet } from 'ethers';
import { Mnemonic } from 'ethers/lib/utils';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from './wallet.service';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { NONPROD_COINS } from '../../constants/coins.nonprod';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { environment } from 'src/environments/environment';
import { Keypair } from '@solana/web3.js';

const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test mnemonic phrase',
};

const testCoins = {
  valid: [NONPROD_COINS[0]],
  invalid: [],
  undefined: null,
};

const testWallet: Wallet = { address: 'testAddress' } as Wallet;
const testWalletSolana: Keypair = { _keypair: { secretKey: 'testPrivate', publicKey: 'testPublic' }} as unknown as Keypair;

describe('WalletService', () => {
  let service: WalletService;
  let walletMnemonicService: WalletMnemonicService;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;
  let blockchainProviderServiceMock;
  let blockchainProviderService: BlockchainProviderService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  beforeEach(() => {
    walletMnemonicServiceSpy = jasmine.createSpyObj(
      'WalletMnemonicService',
      {
        getSeed: Uint8Array.from([0, 50, 52, 103]),
      },
      {
        mnemonic: testMnemonic,
      }
    );
    blockchainProviderServiceMock = {
      getFormattedBalanceOf: (address: string, asset: string) => Promise.resolve('20'),
    };
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve(testWallet),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
        { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });
    service = TestBed.inject(WalletService);
    walletMnemonicService = TestBed.inject(WalletMnemonicService);
    blockchainProviderService = TestBed.inject(BlockchainProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  [
    {
      mnemonic: testMnemonic,
      returnValue: true,
    },
    {
      mnemonic: undefined,
      returnValue: false,
    },
  ].forEach((data) => {
    it(`should return ${data.returnValue} on mnemonicExist and mnemonic ${
      data.returnValue ? '' : 'not'
    } exists`, () => {
      (Object.getOwnPropertyDescriptor(walletMnemonicServiceSpy, 'mnemonic').get as jasmine.Spy).and.returnValue(
        data.mnemonic
      );
      expect(service.mnemonicExists()).toBe(data.returnValue);
    });
  });

  [
    {
      text: 'has one coin',
      coins: testCoins.valid,
      returnValue: true,
    },
    {
      text: 'is empty',
      coins: testCoins.invalid,
      returnValue: false,
    },
    {
      text: 'is undefined',
      coins: testCoins.undefined,
      returnValue: false,
    },
  ].forEach((data) => {
    it(`should return ${data.returnValue} on selectedCoins and coins ${data.text}`, () => {
      service.coins = data.coins;
      expect(service.selectedCoins()).toBe(data.returnValue);
    });
  });

  it('should create wallet if mnemonic exists and there are selected coins', () => {
    const en = 'en';
    spyOn(service, 'mnemonicExists').and.returnValue(true);
    spyOn(service, 'selectedCoins').and.returnValue(true);
    (Object.getOwnPropertyDescriptor(walletMnemonicServiceSpy, 'mnemonic').get as jasmine.Spy).and.returnValue(testMnemonic);
    service.coins = testCoins.valid;
    const spy = spyOn(Wallet, 'fromMnemonic').and.returnValue(testWallet);
    service.create();
    expect(spy).toHaveBeenCalledWith('test mnemonic phrase', "m/44'/60'/0'/0/0", ethers.wordlists[en]);
  });

  [
    {
      mnemonicExists: true,
      selectedCoins: false,
    },
    {
      mnemonicExists: false,
      selectedCoins: true,
    },
    {
      mnemonicExists: false,
      selectedCoins: false,
    },
  ].forEach((data) => {
    it(`should not create wallet if mnemonic ${data.mnemonicExists ? '' : 'not'} exists and there are ${
      data.selectedCoins ? '' : 'not'
    } selected coins'`, () => {
      spyOn(service, 'mnemonicExists').and.returnValue(data.mnemonicExists);
      spyOn(service, 'selectedCoins').and.returnValue(data.selectedCoins);
      const spy = spyOn(Wallet, 'fromMnemonic');
      service.create();
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  it('should call provider get balance when balanceOf is called', async () => {
    const spy = spyOn(blockchainProviderService, 'getFormattedBalanceOf').and.returnValue(Promise.resolve('20'));
    const response = service.balanceOf('testAddress', 'testCoin');
    expect(spy).toHaveBeenCalledWith('testAddress', 'testCoin');
    await expectAsync(response).toBeResolvedTo('20');
  });

  it('should create solana keypair if derivation path matches solana on createForDerivedPath', () => {
    spyOn(Keypair, 'fromSeed').and.returnValue(testWalletSolana);
    const wallet: any = service.createForDerivedPath(environment.derivedPaths.SOLANA);
    expect(wallet.publicKey).toEqual(testWalletSolana.publicKey);
  });

  it('should create ethers wallet if derivation path is not solana on createForDerivedPath', () => {
    spyOn(Wallet, 'fromMnemonic').and.returnValue(testWallet);
    const wallet: any = service.createForDerivedPath(environment.derivedPaths.ERC20);
    expect(wallet.address).toEqual(testWallet.address);
  });

  it('should create solana wallet on create', () => {
    const en = 'en';
    spyOn(service, 'mnemonicExists').and.returnValue(true);
    spyOn(service, 'selectedCoins').and.returnValue(true);
    (Object.getOwnPropertyDescriptor(walletMnemonicServiceSpy, 'mnemonic').get as jasmine.Spy).and.returnValue(testMnemonic);
    service.coins = testCoins.valid;
    const fromMnemonicSpy = spyOn(Wallet, 'fromMnemonic').and.returnValue(testWallet);
    const fromSeedSpy = spyOn(Keypair, 'fromSeed').and.returnValue(testWalletSolana);
    service.create();
    expect(fromMnemonicSpy).toHaveBeenCalledTimes(4);
    expect(fromSeedSpy).toHaveBeenCalledTimes(1);
  });
});
