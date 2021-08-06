import { TestBed } from '@angular/core/testing';
import { ethers, Wallet } from 'ethers';
import { Mnemonic } from 'ethers/lib/utils';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { COINS } from '../../../constants/coins';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from './wallet.service';

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

const testCreatedWallet: Wallet = {
  address: 'testAddress',
  connect: (provider) => ({ address: 'testAddress' } as Wallet),
} as Wallet;

describe('WalletService', () => {
  let service: WalletService;
  let walletMnemonicService: WalletMnemonicService;
  let walletMnemonicServiceMock;
  let languageService: LanguageService;
  let languageServiceMock;

  beforeEach(() => {
    walletMnemonicServiceMock = {
      mnemonic: testMnemonic,
    };
    languageServiceMock = {
      selected: 'en',
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: WalletMnemonicService, useValue: walletMnemonicServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    });
    service = TestBed.inject(WalletService);
    walletMnemonicService = TestBed.inject(WalletMnemonicService);
    languageService = TestBed.inject(LanguageService);
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
    const spy = spyOn(Wallet, 'fromMnemonic').and.returnValue(testCreatedWallet);
    service.create();
    expect(service.createdWallet).toEqual(testCreatedWallet);
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
});
