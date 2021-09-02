import { TestBed } from '@angular/core/testing';
import { ethers, Wallet } from 'ethers';
import { Mnemonic } from 'ethers/lib/utils';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { COINS } from '../../../constants/coins';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from './wallet.service';
import { BlockchainProviderService } from '../brockchain-provider/blockchain-provider.service';
import { ApiWalletService } from '../api-wallet/api-wallet.service';

const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test mnemonic phrase',
};

const testCoins = {
  valid: [COINS[0]],
  invalid: [],
  undefined: null,
};

const testWallet: Wallet = { address: 'testAddress' } as Wallet;
const testCreatedWallets: Wallet[] = [testWallet];
const testAddresses = {
  one: { RSK: 'testAddress' },
  none: {},
};

fdescribe('WalletService', () => {
  let service: WalletService;
  let walletMnemonicService: WalletMnemonicService;
  let walletMnemonicServiceMock;
  let languageService: LanguageService;
  let languageServiceMock;
  let blockchainProviderServiceMock;
  let blockchainProviderService: BlockchainProviderService;
  let apiWalletService: ApiWalletService;
  let apiWalletServiceMock;

  beforeEach(() => {
    apiWalletServiceMock = {
      getPrices: (coins) => Promise.resolve({ prices: { BTC: 3000 } }),
    };
    walletMnemonicServiceMock = {
      mnemonic: testMnemonic,
    };
    languageServiceMock = {
      selected: 'en',
    };
    blockchainProviderServiceMock = {
      getFormattedBalanceOf: (address: string, asset: string) => Promise.resolve('20'),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: WalletMnemonicService, useValue: walletMnemonicServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
        { provide: ApiWalletService, useValue: apiWalletServiceMock },
      ],
    });
    service = TestBed.inject(WalletService);
    walletMnemonicService = TestBed.inject(WalletMnemonicService);
    languageService = TestBed.inject(LanguageService);
    blockchainProviderService = TestBed.inject(BlockchainProviderService);
    apiWalletService = TestBed.inject(ApiWalletService);
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
      walletMnemonicServiceMock.mnemonic = data.mnemonic;
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
    walletMnemonicService.mnemonic = testMnemonic;
    languageService.selected = 'en';
    service.coins = testCoins.valid;
    const spy = spyOn(Wallet, 'fromMnemonic').and.returnValue(testWallet);
    service.create();
    expect(service.createdWallets).toEqual(testCreatedWallets);
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

  it('should return one coin when wallet has one coin on getWalletCoins', () => {
    service.addresses = testAddresses.one;
    const walletCoins = service.getWalletCoins();
    expect(walletCoins.length).toBe(1);
  });

  it('should return zero coins when wallet has not coins on getWalletCoins', () => {
    service.addresses = testAddresses.none;
    const walletCoins = service.getWalletCoins();
    expect(walletCoins.length).toBe(0);
  });

  // it('should return one coin when wallet has one coin on getWalletCoinsName', () => {
  //   service.addresses = testAddresses.one;
  //   const walletCoins = service.getWalletCoinsName();
  //   expect(walletCoins[0]).toBe('RBTC');
  // });

  // it('should return zero coins when wallet has not coins on getWalletCoinsName', () => {
  //   service.addresses = testAddresses.none;
  //   const walletCoins = service.getWalletCoinsName();
  //   expect(walletCoins.length).toBe(0);
  // });

  xit('should get balance for a wallet on getWalletBalances', () => {
    service.addresses = testAddresses.one;
    spyOn(service, 'balanceOf').and.returnValue(Promise.resolve('20'));
    service.getWalletBalances().subscribe((data) => {
      expect(data[0].amount).toBe(20);
    });
  });

  xit('should get usd balance for a wallet on getWalletBalances', () => {
    service.addresses = testAddresses.one;
    spyOn(service, 'balanceOf').and.returnValue(Promise.resolve('20'));
    service.getWalletBalances().subscribe((data) => {
      expect(data[0].usdAmount).toBe(60000);
    });
  });
});
