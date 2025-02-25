import { TestBed } from '@angular/core/testing';
import { WalletMnemonicService } from './wallet-mnemonic.service';
import { Wallet } from 'ethers';

describe('WalletMnemonicService', () => {
  let service: WalletMnemonicService;
  let fakeWallet: jasmine.SpyObj<Wallet>;
  let utilsSpy: jasmine.SpyObj<any>;

  const testMnemonic = {
    constant: {
      locale: 'en',
      phrase: 'test mnemonic constant',
      path: '',
    },
    wallet: {
      locale: 'en',
      phrase: 'test mnemonic wallet',
      path: '',
    },
  };

  beforeEach(() => {
    utilsSpy = jasmine.createSpyObj('utils', {
      mnemonicToSeed: '0x00323467',
      arrayify: Uint8Array.from([0, 50, 52, 103])
    });
    fakeWallet = jasmine.createSpyObj('Wallet', {
      _mnemonic: testMnemonic.wallet,
    });
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletMnemonicService);
    service.utils = utilsSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a mnemonic on mnemonic', () => {
    const mnemonic = service.newMnemonic();
    expect(mnemonic.phrase.split(' ').length).toBe(12);
  });

  it('should use en as language when creating a new mnemonic', () => {
    const mnemonic = service.newMnemonic();
    expect(mnemonic.locale).toBe('en');
  });

  it('should return the mnemonic if mnemonic is already set on getMnemonic', () => {
    service.mnemonic = testMnemonic.constant;
    const mnemonic = service.getMnemonic();
    expect(mnemonic).toEqual(testMnemonic.constant);
    expect(service.mnemonic).toEqual(testMnemonic.constant);
  });

  it('should return the mnemonic if mnemonic is already set and a wallet is passed on getMnemonic', () => {
    service.mnemonic = testMnemonic.constant;
    const mnemonic = service.getMnemonic(fakeWallet);
    expect(mnemonic).toEqual(testMnemonic.constant);
    expect(service.mnemonic).toEqual(testMnemonic.constant);
  });

  it('should get the mnemonic and return it if mnemonic is not set and a wallet is passed on getMnemonic', () => {
    service.mnemonic = undefined;
    const mnemonic = service.getMnemonic(fakeWallet);
    expect(mnemonic).toEqual(testMnemonic.wallet);
    expect(service.mnemonic).toEqual(testMnemonic.wallet);
  });

  it('should throw exception if mnemonic is not set amd a wallet is not passed on getMnemonic', () => {
    service.mnemonic = undefined;
    expect(service.getMnemonic).toThrowError(TypeError, "Cannot read properties of undefined (reading 'mnemonic')");
  });
});
