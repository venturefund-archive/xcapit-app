import { TestBed } from '@angular/core/testing';
import { WalletService } from '../wallet/wallet.service';
import { WalletEncryptionService } from './wallet-encryption.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { Coin } from '../../interfaces/coin.interface';
import { environment } from '../../../../../../environments/environment';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { FakeEthersService } from 'src/testing/fakes/ethers.fake.spec';
import { EthersService } from '../ethers/ethers.service';
import { PasswordErrorMsgs } from 'src/app/modules/swaps/shared-swaps/models/password/password-error-msgs';
import { Wallet } from 'ethers';
import { Keypair } from '@solana/web3.js';

const storageWallet = {
  alias: '0xa8d720DBC2bea006e8450a6c0456e169d2fD7954',
  wallet:
    '{"address":"a8d720dbc2bea006e8450a6c0456e169d2fd7954","id":"4c559f54-bcc2-447e-aacf-215d61402c04","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"256988c1ef9a6c7f7baa788a4c2f6049"},"ciphertext":"424cb609679351166ed8ec32e755f6bf0da3bc24564865e375f447d2c1e9aff9","kdf":"scrypt","kdfparams":{"salt":"2202153f3cafa53809c177c80da0880d3a928f24988f786b186825b15ee2b833","n":131072,"dklen":32,"p":1,"r":8},"mac":"d9d41ba202a2520883ab3b933eeeb0a129d4884b7bb88661758edec8fabf3002"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2021-09-07T14-51-41.0Z--a8d720dbc2bea006e8450a6c0456e169d2fd7954","mnemonicCounter":"0b972e8bdfb383008c2709eea1a5045d","mnemonicCiphertext":"d3b1c4361bebae20854f01128665ca48","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}',
  createdAt: '2021-09-07T14:51:41Z',
  updatedAt: '2021-09-07T14:51:41Z',
  addresses: {
    ERC20: '0xa8d720DBC2bea006e8450a6c0456e169d2fD7954',
    RSK: '0xFfe923cd87289eD785ca175cdb6232B8F13f0cd9',
  },
  network: 'testnet',
  assets: {
    ETH: true,
    LINK: true,
    USDT: true,
    AAVE: true,
    UNI: true,
    RBTC: true,
    RIF: true,
  },
};

const modifiedPasswordWallet = {
  alias: '0xa8d720DBC2bea006e8450a6c0456e169d2fD7954',
  wallet:
  '{"address":"a8d720dbc2bea006e8450a6c0456e169d2fd7954","id":"172d5b6d-79d2-478d-8afa-e91fa1039c69","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"ddcda5cf1d921ef05e9c63ee1b5cd633"},"ciphertext":"acad69b6ccc3b29937f72cb488f2dab23ff0a8c1e908a4a911f481663e45b9ff","kdf":"scrypt","kdfparams":{"salt":"a452c84af6af7d0221e5c93bbaeaf0a1738646fdb94c4bc51acd74b9e701d973","n":131072,"dklen":32,"p":1,"r":8},"mac":"676ccdb738d6be29072d5fa5834ba1955e9bf810520dda26efc0afb03db333c5"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2022-01-14T12-04-03.0Z--a8d720dbc2bea006e8450a6c0456e169d2fd7954","mnemonicCounter":"6915834b58f4c8486abeadbebfcdf8ef","mnemonicCiphertext":"2670a5bbab9a30ada4d420fe6fd979a4","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}',
  createdAt: '2021-09-07T14:51:41Z',
  updatedAt: '2021-09-07T14:51:41Z',
  addresses: {
    ERC20: '0xa8d720DBC2bea006e8450a6c0456e169d2fD7954',
    RSK: '0xFfe923cd87289eD785ca175cdb6232B8F13f0cd9',
  },
  network: 'testnet',
  assets: {
    ETH: true,
    LINK: true,
    USDT: true,
    AAVE: true,
    UNI: true,
    RBTC: true,
    RIF: true,
  },
};

const testCoins: Coin[] = [
  {
    id: 1,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test',
  },
  {
    id: 2,
    name: 'coinTest2',
    logoRoute: '../../assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test',
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: '../../assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: environment.rskApiUrl,
  },
];

const testCoinsStructure = {
  ETH: true,
  USDT: true,
  RBTC: true,
};

fdescribe('WalletEncryptionService', () => {
  let service: WalletEncryptionService;
  let storageSpy: any;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeEthers: FakeEthersService;
  let ethersServiceSpy: jasmine.SpyObj<EthersService>;
  let ethersWalletSpy: jasmine.SpyObj<Wallet>;
  let solanaWalletSpy: jasmine.SpyObj<Keypair>;

  beforeEach(() => {
    fakeEthers = new FakeEthersService();
    ethersServiceSpy = fakeEthers.createSpy();
    // TODO: Finish making spies
    ethersWalletSpy = jasmine.createSpyObj('Wallet', {
      encrypt: Promise.resolve(storageWallet),
    },
    {
      address: 'testAddress',
      mnemonic: {
        path: "m/44'/60'/0'/0/0",
      }
    });
    storageSpy = jasmine.createSpyObj('StorageService', ['saveWalletToStorage', 'getWalletFromStorage']);
    jasmine.setDefaultSpyStrategy((and) => and.callThrough());
    walletServiceSpy = jasmine.createSpyObj(
      'WalletService',
      {
        createForDerivedPath: ethersWalletSpy
      },
      {
        coins: testCoins,
      }
    );
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: testCoins,
    });
    jasmine.setDefaultSpyStrategy((and) => and.stub());
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: EthersService, useValue: ethersServiceSpy },
      ],
    });
    service = TestBed.inject(WalletEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt ETH wallet from array', async () => {
    const res = await service.encryptWallet('testPassword');
    expect(res).toEqual(true);
    expect(storageSpy.saveWalletToStorage).toHaveBeenCalled();
  });

  it('should return true if wallet exist when encryptedWalletExist', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(Promise.resolve(storageWallet));
    const walletExist = await service.encryptedWalletExist();
    expect(walletExist).toEqual(true);
  });

  it('should return false if wallet doesnt exist when encryptedWalletExist', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(undefined);
    const walletExist = await service.encryptedWalletExist();
    expect(walletExist).toEqual(false);
  });

  it('should return the selected coins structure by the user when selectedAssetsStructure', () => {
    service.coins = testCoins;
    const selectedAssets = service.selectedAssetsStructure();
    expect(selectedAssets).toEqual(testCoinsStructure);
  });

  it('should return the wallet from localstorage when getEncryptedWallet', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(Promise.resolve(storageWallet));
    const resWallet = await service.getEncryptedWallet();
    expect(resWallet).toEqual(storageWallet);
  });

  it('should get decrypted wallet for ETH with ERC20 derived path', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(Promise.resolve(storageWallet));
    const currencyWallet = await service.getDecryptedWalletForCurrency('TestPass1234', testCoins[0]);
    expect(currencyWallet.mnemonic.path).toBe("m/44'/60'/0'/0/0");
  });

  it('should get decrypted wallet for rBTC with RSK derived path', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(Promise.resolve(storageWallet));
    const currencyWallet = await service.getDecryptedWalletForCurrency('TestPass1234', testCoins[2]);
    expect(currencyWallet.mnemonic.path).toBe("m/44'/37310'/0'/0/0");
  });

  it('should get decrypted wallet for Ethereum network', async () => {
    storageSpy.getWalletFromStorage.and.returnValue(Promise.resolve(storageWallet));
    const currencyWallet = await service.getDecryptedWalletForNetwork('TestPass1234', 'ETH');
    expect(currencyWallet.mnemonic.path).toBe("m/44'/60'/0'/0/0");
  });

  it('should change password if oldPassword is correct on changePassword', async () => {
    const wallet = JSON.parse(JSON.stringify(storageWallet));
    storageSpy.getWalletFromStorage.and.returnValue(Promise.resolve(wallet));
    fakeEthers.modifyReturns(null, wallet, modifiedPasswordWallet.wallet, null);
    await service.changePassword('TestPass1234', 'TestPassword2');
    expect(storageSpy.saveWalletToStorage).toHaveBeenCalledWith(modifiedPasswordWallet);
  });

  it('should not change password and throw error if oldPassword is wrong on changePassword', async () => {
    const invalidPasswordErrorMsg = new PasswordErrorMsgs().invalid();
    const wallet = JSON.parse(JSON.stringify(storageWallet));
    storageSpy.getWalletFromStorage.and.returnValue(Promise.resolve(wallet));
    fakeEthers.throwError(invalidPasswordErrorMsg);

    try {
      await service.changePassword('TestPass1', 'TestPassword2');
    } catch (error) {
      expect(error.message).toEqual(invalidPasswordErrorMsg);
    }
  });
});
