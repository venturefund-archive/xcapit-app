import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../../../../shared/services/language/language.service';
import { BwcService } from './bwc.service';
import BWC from 'bitcore-wallet-client';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { ApiProfilesService } from '../../../../profiles/shared-profiles/services/api-profiles/api-profiles.service';
import { of } from 'rxjs';

const testOpts = {
  bwsurl: 'localhost',
};

const testKey = new Key({
  seedType: 'new',
  language: 'es',
  useLegacyCoinType: false,
  useLegacyPurpose: false,
});

const testToken = {
  name: 'Paxos Standard',
  symbol: 'PAX',
  decimal: 18,
  address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
};

const testCoin = {
  id: 1,
  name: 'BTC - Bitcoin',
  logoRoute: '../../assets/img/coins/BTC.svg',
  last: false,
  symbol: 'BTC',
};

const testWalletOptions = {
  btcWallet: {
    walletName: 'BTC Wallet',
    copayerName: 'Federico Marquez',
    password: 'fede123',
    coin: 'btc',
    network: 'testnet',
    account: 0,
    totalCopayers: 1,
    minimumSignsForTx: 1,
    singleAddress: false,
    nativeSegWit: true,
    seed: {
      seedType: 0,
    },
  },
  btcDefaultWallet: {
    walletName: 'BTC - Bitcoin Wallet',
    copayerName: 'Federico Marquez',
    password: 'fede123',
    coin: 'btc',
    network: 'livenet',
    account: 0,
    totalCopayers: 1,
    minimumSignsForTx: 1,
    singleAddress: false,
    nativeSegWit: true,
    seed: {
      seedType: 0,
    },
  },
  ethWallet: {
    walletName: 'ETH Wallet',
    copayerName: 'Federico Marquez',
    password: 'fede123',
    coin: 'eth',
    network: 'testnet',
    account: 0,
    totalCopayers: 3,
    minimumSignsForTx: 2,
    singleAddress: false,
    nativeSegWit: false,
    seed: {
      seedType: 0,
    },
  },
};

const testWalletGroups = {
  noBTCWallets: {
    rootKey: testKey,
    wallets: [
      {
        walletClient: new BWC({
          baseUrl: 'localhost',
          verbose: false,
          timeout: 100000,
          transports: ['polling'],
        }),
        secret: null,
      },
    ],
  },
  noWallets: {
    rootKey: testKey,
    wallets: [],
  },
  twoBTCWallets: {
    rootKey: new Key({
      seedType: 'new',
      language: 'es',
      useLegacyCoinType: false,
      useLegacyPurpose: false,
    }),
    wallets: [
      {
        walletClient: new BWC({
          baseUrl: 'localhost',
          verbose: false,
          timeout: 100000,
          transports: ['polling'],
        }),
        secret: null,
      },
      {
        walletClient: new BWC({
          baseUrl: 'localhost',
          verbose: false,
          timeout: 100000,
          transports: ['polling'],
        }),
        secret: null,
      },
      {
        walletClient: new BWC({
          baseUrl: 'localhost',
          verbose: false,
          timeout: 100000,
          transports: ['polling'],
        }),
        secret: null,
      },
    ],
  },
};

fdescribe('BwcService', () => {
  let service: BwcService;
  let languageServiceMock: any;
  let bwcSpy: any;
  let bwcMock: any;
  let getClientSpy: any;
  let apiProfilesServiceMock: any;

  beforeEach(() => {
    languageServiceMock = { selected: 'es' };
    apiProfilesServiceMock = {
      crud: {
        get: () => of({}),
      },
    };
    bwcSpy = jasmine.createSpyObj(BWC, ['createWallet', 'fromString', 'fromObj', 'joinWallet']);
    bwcSpy.createWallet.and.callFake((name, copayerName, m, n, opts, cb) => {
      cb(null, {});
      return Promise.resolve();
    });
    bwcSpy.joinWallet.and.callFake((secret, copayerName, opts, cb) => {
      cb(null);
      return Promise.resolve();
    });
    bwcMock = {
      parseSecret: (secret) => ({ coin: 'btc', network: 'testnet' }),
    };

    bwcSpy.credentials = {
      walletPrivKey: '',
      getTokenCredentials: (token) => Promise.resolve(),
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: ApiProfilesService, useValue: apiProfilesServiceMock },
      ],
    });

    service = TestBed.inject(BwcService);
    service.Client = bwcMock;
    getClientSpy = spyOn(service, 'getClient').and.returnValue(bwcSpy);
    service.bwsInstanceUrl = 'localhost';

    testWalletGroups.noBTCWallets.wallets[0].walletClient.fromString(
      testKey.createCredentials(null, {
        coin: 'eth',
        network: 'testnet',
        account: 0,
        n: 1,
      })
    );

    testWalletGroups.twoBTCWallets.wallets[0].walletClient.fromString(
      testKey.createCredentials(null, {
        coin: 'btc',
        network: 'testnet',
        account: 0,
        n: 1,
      })
    );

    testWalletGroups.twoBTCWallets.wallets[1].walletClient.fromString(
      testKey.createCredentials(null, {
        coin: 'eth',
        network: 'testnet',
        account: 0,
        n: 1,
      })
    );

    testWalletGroups.twoBTCWallets.wallets[2].walletClient.fromString(
      testKey.createCredentials(null, {
        coin: 'btc',
        network: 'testnet',
        account: 1,
        n: 1,
      })
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a client instance when getClient is called', () => {
    getClientSpy.and.callThrough();
    service.Client = BWC;
    const client = service.getClient();
    expect(client).toBeInstanceOf(service.Client);
  });

  it('should create a client instance from the options when when getClient is called with an opts param', () => {
    getClientSpy.and.callThrough();
    service.Client = BWC;
    const client = service.getClient(null, testOpts);
    expect(client.request.baseUrl).toEqual(testOpts.bwsurl);
  });

  it('should create a WalletGroup on createWalletAndGroup', async () => {
    const walletGroup = await service.createWalletAndGroup(testWalletOptions.btcWallet);

    expect(walletGroup).toBeDefined();
    expect(Object.keys(walletGroup)).toContain('wallets');
    expect(Object.keys(walletGroup)).toContain('rootKey');
  });

  it('should create a Wallet on createWalletAndGroup', async () => {
    const walletGroup = await service.createWalletAndGroup(testWalletOptions.btcWallet);

    expect(walletGroup.wallets[0]).toBeDefined();
    expect(Object.keys(walletGroup.wallets[0])).toContain('walletClient');
    expect(Object.keys(walletGroup.wallets[0])).toContain('secret');
  });

  it('should create a Wallet on createWalletFromKey', async () => {
    const wallet = await service.createWalletFromKey(testWalletOptions.btcWallet, testKey);

    expect(wallet).toBeDefined();
    expect(Object.keys(wallet)).toContain('walletClient');
    expect(Object.keys(wallet)).toContain('secret');
  });

  it('should call createWalletFromKey on createWalletAndAddToGroup', async () => {
    const spy = spyOn(service, 'createWalletFromKey').and.returnValue(
      Promise.resolve({ walletClient: null, secret: null })
    );
    await service.createWalletAndAddToGroup(testWalletOptions[0], { rootKey: null, wallets: [] });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call createWalletFromKey 2 times on createMultipleWalletsAndAddToGroup', async () => {
    const spy = spyOn(service, 'createWalletFromKey').and.returnValue(
      Promise.resolve({ walletClient: null, secret: null })
    );
    const walletOptions = [testWalletOptions.btcWallet, testWalletOptions.ethWallet];
    await service.createMultipleWalletsAndAddToGroup(walletOptions, { rootKey: null, wallets: [] });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should create a WalletGroup on createTokenWalletFromEthWallet', async () => {
    const wallet = await service.createWalletFromKey(testWalletOptions.ethWallet, testKey);
    const tokenWallet = await service.createTokenWalletFromEthWallet(testToken, wallet);
    expect(tokenWallet).toBeDefined();
    expect(Object.keys(tokenWallet)).toContain('walletClient');
    expect(Object.keys(tokenWallet)).toContain('secret');
  });

  it('should create a WalletGroup on joinWallet', async () => {
    const walletGroup = await service.joinWallet('secret');
    expect(walletGroup).toBeDefined();
    expect(Object.keys(walletGroup)).toContain('wallets');
    expect(Object.keys(walletGroup)).toContain('rootKey');
  });

  it('should create a Wallet on joinWallet', async () => {
    const walletGroup = await service.joinWallet('secret');
    expect(walletGroup.wallets[0]).toBeDefined();
    expect(Object.keys(walletGroup.wallets[0])).toContain('walletClient');
    expect(Object.keys(walletGroup.wallets[0])).toContain('secret');
  });

  it('should return 0 if there are no BTC wallets in the WalletGroup when calling getNextAccount for BTC', () => {
    const account = service.getNextAccount(testCoin, testWalletGroups.noBTCWallets);
    expect(account).toBe(0);
  });

  it('should return 0 if there are no wallets in the WalletGroup when calling getNextAccount for BTC', () => {
    const account = service.getNextAccount(testCoin, testWalletGroups.noWallets);
    expect(account).toBe(0);
  });

  it('should return 2 if there are 2 wallets in the WalletGroup when calling getNextAccount for BTC', () => {
    const account = service.getNextAccount(testCoin, testWalletGroups.twoBTCWallets);
    expect(account).toBe(2);
  });

  it('should return the user email if user has no name on getUserName', () => {
    const userData = { email: 'test@xcapit.com' };
    apiProfilesServiceMock.crud.get = () => of(userData);
    service.getUserName().subscribe((data) => {
      expect(data).toBe(userData.email);
    });
  });

  it('should return the user name if user has no name on getUserName', () => {
    const userData = { first_name: 'Test' };
    apiProfilesServiceMock.crud.get = () => of(userData);
    service.getUserName().subscribe((data) => {
      expect(data).toBe(userData.first_name);
    });
  });

  it('should return the right WalletOptions when calling getDefaultWalletOptions', () => {
    service.password = 'fede123';
    service.copayerName = 'Federico Marquez';
    const walletOptions = service.getDefaultWalletOptions(testCoin);
    expect(walletOptions).toEqual(testWalletOptions.btcDefaultWallet);
  });

  it('should return Bitcoin on getCoin with btc', () => {
    const coin = service.getCoin('btc');
    expect(coin).toEqual(testCoin);
  });
});
