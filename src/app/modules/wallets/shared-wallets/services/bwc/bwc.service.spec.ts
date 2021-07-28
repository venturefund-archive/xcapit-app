import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../../../../shared/services/language/language.service';
import { BwcService } from './bwc.service';
import BWC from 'bitcore-wallet-client';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';

const testOpts = {
  bwsurl: 'localhost',
};

const testKey = new Key({
  seedType: 'new',
  language: 'es',
  useLegacyCoinType: false,
  useLegacyPurpose: false,
});

const testTokens = {
  pax: {
    name: 'Paxos Standard',
    symbol: 'PAX',
    decimal: 18,
    address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
  },
  gusd: {
    name: 'Gemini Dollar',
    symbol: 'GUSD',
    decimal: 2,
    address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
  },
};

const testCoins = {
  btc: {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    last: false,
    symbol: 'BTC',
  },
  eth: {
    id: 4,
    name: 'ETH - Ethereum',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: true,
    symbol: 'ETH',
  },
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
  ethDefaultWallet: {
    walletName: 'ETH - Ethereum Wallet',
    copayerName: 'Federico Marquez',
    password: 'fede123',
    coin: 'eth',
    network: 'testnet',
    account: 0,
    totalCopayers: 1,
    minimumSignsForTx: 1,
    singleAddress: false,
    nativeSegWit: false,
    seed: {
      seedType: 0,
    },
  },
  sharedBtcDefaultWallet: {
    walletName: 'BTC - Bitcoin Shared Wallet',
    copayerName: 'Federico Marquez',
    password: 'fede123',
    coin: 'btc',
    network: 'testnet',
    account: 0,
    totalCopayers: 3,
    minimumSignsForTx: 2,
    singleAddress: false,
    nativeSegWit: true,
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

describe('BwcService', () => {
  let service: BwcService;
  let languageServiceMock: any;
  let bwcSpy: any;
  let bwcMock: any;
  let getClientSpy: any;
  let hasDoneSetUp = false;

  beforeEach(() => {
    languageServiceMock = { selected: 'es' };
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
      coin: 'eth',
      getTokenCredentials: (token) => Promise.resolve(),
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
    });

    service = TestBed.inject(BwcService);
    service.Client = bwcMock;
    getClientSpy = spyOn(service, 'getClient').and.returnValue(bwcSpy);
    service.bwsInstanceUrl = 'localhost';

    if (!hasDoneSetUp) {
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

      hasDoneSetUp = true;
    }
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

  it('should create a WalletGroup on createWalletAndGroup with shared wallet options', async () => {
    const walletGroup = await service.createWalletAndGroup(testWalletOptions.sharedBtcDefaultWallet);

    expect(walletGroup).toBeDefined();
    expect(Object.keys(walletGroup)).toContain('wallets');
    expect(Object.keys(walletGroup)).toContain('rootKey');
  });

  it('should create a Wallet on createWalletAndGroup with shared wallet options', async () => {
    const walletGroup = await service.createWalletAndGroup(testWalletOptions.sharedBtcDefaultWallet);

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

  it('should add new Wallet to WalletGroup on createWalletAndAddToGroup', async () => {
    spyOn(service, 'createWalletFromKey').and.returnValue(Promise.resolve({ walletClient: null, secret: null }));
    const walletGroup = await service.createWalletAndAddToGroup(testWalletOptions[0], { rootKey: null, wallets: [] });
    expect(walletGroup.wallets.length).toEqual(1);
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
    const tokenWallet = await service.createTokenWalletFromEthWallet(testTokens.pax, wallet);
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
    const account = service.getNextAccount(testCoins.btc, testWalletGroups.noBTCWallets);
    expect(account).toBe(0);
  });

  it('should return 0 if there are no wallets in the WalletGroup when calling getNextAccount for BTC', () => {
    const account = service.getNextAccount(testCoins.btc, testWalletGroups.noWallets);
    expect(account).toBe(0);
  });

  it('should return 2 if there are 2 wallets in the WalletGroup when calling getNextAccount for BTC', () => {
    const account = service.getNextAccount(testCoins.btc, testWalletGroups.twoBTCWallets);
    expect(account).toBe(2);
  });

  it('should return the right WalletOptions when calling getDefaultWalletOptions', () => {
    service.password = 'fede123';
    service.copayerName = 'Federico Marquez';
    const walletOptions = service.getDefaultWalletOptions(testCoins.btc);
    expect(walletOptions).toEqual(testWalletOptions.btcDefaultWallet);
  });

  it('should return Bitcoin on getCoin with btc', () => {
    const coin = service.getCoin('btc');
    expect(coin).toEqual(testCoins.btc);
  });

  it('should use default options on createSharedWallet', async () => {
    const spy = spyOn(service, 'createWalletAndGroup').and.returnValue(Promise.resolve(testWalletGroups.noWallets));
    service.copayerName = 'Federico Marquez';
    service.password = 'fede123';
    await service.createSharedWallet(testCoins.btc, 3, 2, undefined, undefined, 'testnet');
    expect(spy).toHaveBeenCalledWith(testWalletOptions.sharedBtcDefaultWallet);
  });

  it('should call createTokenWalletFromEthWallet as many times as tokens are on createMultipleTokenWalletsInGroup', async () => {
    const tokens = [testTokens.gusd, testTokens.pax];
    const spy = spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.twoBTCWallets));
    await service.createMultipleTokenWalletsInGroup(tokens, originalWalletGroup);
    expect(spy).toHaveBeenCalledTimes(tokens.length);
  });

  it('should add all token wallets to WalletGroup on createMultipleTokenWalletsInGroup', async () => {
    const tokens = [testTokens.gusd, testTokens.pax];
    spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.twoBTCWallets));
    const expectedLength = originalWalletGroup.wallets.length + tokens.length;
    const walletGroup = await service.createMultipleTokenWalletsInGroup(tokens, originalWalletGroup);
    expect(walletGroup.wallets.length).toEqual(expectedLength);
  });

  it('should not call createWalletAndAddToGroup if there are ETH wallets on createMultipleTokenWalletsInGroup', async () => {
    const tokens = [testTokens.gusd, testTokens.pax];
    spyOn(service, 'getCoin').and.returnValue(testCoins.eth);
    spyOn(service, 'getDefaultWalletOptions').and.returnValue(testWalletOptions.ethWallet);
    spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const spy = spyOn(service, 'createWalletAndAddToGroup').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets)
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.twoBTCWallets));
    await service.createMultipleTokenWalletsInGroup(tokens, originalWalletGroup);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call createWalletAndAddToGroup if there are no ETH wallets on createMultipleTokenWalletsInGroup', async () => {
    const tokens = [testTokens.gusd, testTokens.pax];
    spyOn(service, 'getCoin').and.returnValue(testCoins.eth);
    spyOn(service, 'getDefaultWalletOptions').and.returnValue(testWalletOptions.ethWallet);
    spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const spy = spyOn(service, 'createWalletAndAddToGroup').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets)
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.noWallets));
    await service.createMultipleTokenWalletsInGroup(tokens, originalWalletGroup);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call createTokenWalletFromEthWallet if there are no tokens on createMultipleTokenWalletsInGroup', async () => {
    const tokens = [];
    const spy = spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.twoBTCWallets));
    await service.createMultipleTokenWalletsInGroup(tokens, originalWalletGroup);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call createTokenWalletFromEthWallet on createSimpleTokenWallet', async () => {
    const spy = spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.twoBTCWallets));
    await service.createSimpleTokenWallet(testTokens.gusd, originalWalletGroup);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should add token wallets to WalletGroup on createSimpleTokenWallet', async () => {
    spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.twoBTCWallets));
    const expectedLength = originalWalletGroup.wallets.length + 1;
    const walletGroup = await service.createSimpleTokenWallet(testTokens.gusd, originalWalletGroup);
    expect(walletGroup.wallets.length).toEqual(expectedLength);
  });

  it('should not call createWalletAndAddToGroup if there are ETH wallets on createSimpleTokenWallet', async () => {
    spyOn(service, 'getCoin').and.returnValue(testCoins.eth);
    spyOn(service, 'getDefaultWalletOptions').and.returnValue(testWalletOptions.ethWallet);
    spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const spy = spyOn(service, 'createWalletAndAddToGroup').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets)
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.twoBTCWallets));
    await service.createSimpleTokenWallet(testTokens.gusd, originalWalletGroup);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call createWalletAndAddToGroup if there are no ETH wallets on createSimpleTokenWallet', async () => {
    spyOn(service, 'getCoin').and.returnValue(testCoins.eth);
    spyOn(service, 'getDefaultWalletOptions').and.returnValue(testWalletOptions.ethWallet);
    spyOn(service, 'createTokenWalletFromEthWallet').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets.wallets[1])
    );
    const spy = spyOn(service, 'createWalletAndAddToGroup').and.returnValue(
      Promise.resolve(testWalletGroups.twoBTCWallets)
    );
    const originalWalletGroup = JSON.parse(JSON.stringify(testWalletGroups.noWallets));
    await service.createSimpleTokenWallet(testTokens.gusd, originalWalletGroup);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set nativeSegWit to false if coin is not BTC on createSimpleWalletGroup', async () => {
    const spy = spyOn(service, 'createWalletAndGroup').and.returnValue(Promise.resolve(testWalletGroups.noWallets));
    const walletOptions = testWalletOptions.ethDefaultWallet;
    service.copayerName = walletOptions.copayerName;
    service.password = walletOptions.password;
    await service.createSimpleWalletGroup(testCoins.eth, true, walletOptions.singleAddress, walletOptions.network);
    expect(spy).toHaveBeenCalledWith(walletOptions);
  });

  it('should not set nativeSegWit to false if coin is BTC on createSimpleWalletGroup', async () => {
    const spy = spyOn(service, 'createWalletAndGroup').and.returnValue(Promise.resolve(testWalletGroups.noWallets));
    const walletOptions = testWalletOptions.btcDefaultWallet;
    service.copayerName = walletOptions.copayerName;
    service.password = walletOptions.password;
    await service.createSimpleWalletGroup(
      testCoins.btc,
      walletOptions.nativeSegWit,
      walletOptions.singleAddress,
      walletOptions.network
    );
    expect(spy).toHaveBeenCalledWith(walletOptions);
  });

  it('should create a WalletGroup containing all Wallets on createMultipleWallets', async () => {
    const coins = [testCoins.btc, testCoins.eth];
    const tokens = [testTokens.pax, testTokens.gusd];
    const result = await service.createMultipleWallets(coins, tokens);
    expect(result.wallets.length).toEqual(4);
  });
});
