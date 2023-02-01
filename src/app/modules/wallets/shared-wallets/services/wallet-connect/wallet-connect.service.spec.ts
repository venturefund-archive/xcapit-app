import { TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { WalletTransactionsService } from '../../services/wallet-transactions/wallet-transactions.service';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import WalletConnect from '@walletconnect/client';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { alertControllerMock } from '../../../../../../testing/spies/alert-controller-mock.spec';
import { WalletConnectService } from './wallet-connect.service';
import { ethers, Wallet } from 'ethers';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { rawEIP712Data } from '../../fixtures/raw-eip-712-data';


describe('WalletConnectService', () => {
  const testUri =
    'wc:2a57d842-7977-4de0-ac22-0dd57bc326a6@1?bridge=https%3A%2F%2Fb.bridge.walletconnect.org&key=70f7fa5486706b77377a5672e6d45c0d19b9b12f6a44d80928a9f0eac5629392';

  const testWallet = {
    address: '0x00000000000001',
    chainId: 1,
    symbol: 'ETH',
    rpc: 'https://testRpc',
    network: 'ERC20',
  };

  const requestSendTransaction = {
    method: 'eth_sendTransaction',
    params: [
      {
        gas: '21000',
        value: '5',
        from: '0x00000000002',
        data: '',
      },
    ],
  };

  const requestPersonalSign = {
    method: 'personal_sign',
    params: ['0x48656c6c6f20576f726c64', '0x00000000002'],
  };

  const requestEthSign = {
    method: 'eth_sign',
    params: ['0x00000000002', '0x48656c6c6f20576f726c64'],
  };

  const requestTypedData = {
    method: 'eth_signTypedData',
    params: ['0x00000000002', rawEIP712Data],
  };

  const unsupportedRequestTypedData = {
    method: 'eth_signTypedData_v6',
    params: [
      '0x00000000002',
      '{"types":{},"domain":{"name":"Test"},"primaryType":"TestRequest","message":{"target":"0x00000000001","gasData":{"gasLimit":"21000","gasPrice":"1700000000"}}}',
    ],
  };

  const approveRequest = {
    id: 1652811888491198,
    jsonrpc: '2.0',
    method: 'eth_sendTransaction',
    params: [
      {
        data: '0x095ea7b3000000000000000000000000f55c496bb1058690db1401c4b9c19f3f44374961ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        from: '0x9c7314d0745bf0df80040dabd6ce87efcc5969e8',
        gas: '0xcd71',
        gasPrice: '0x3e252e0',
        to: '0x4da7997a819bb46b6758b9102234c289dd2ad3bf',
      },
    ],
  };

  const swapRequest = {
    id: 1652813134921140,
    jsonrpc: '2.0',
    method: 'eth_sendTransaction',
    params: [
      {
        data: '0x8803dbee000000000000000000000000000000000000000000000000000041c1dfeeb74100000000000000000000000000000000000000000000000017cfae1d842fe7cb00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000009c7314d0745bf0df80040dabd6ce87efcc5969e8000000000000000000000000000000000000000000000000000000006283f1ff000000000000000000000000000000000000000000000000000000000000000300000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe00000000000000000000000009b6ca5e4496238a1f176aea6bb607db96c2286e0000000000000000000000004da7997a819bb46b6758b9102234c289dd2ad3bf',
        from: '0x9c7314d0745bf0df80040dabd6ce87efcc5969e8',
        gas: '0x3762c',
        gasPrice: '0x3e252e0',
        to: '0xf55c496bb1058690db1401c4b9c19f3f44374961',
      },
    ],
  };

  const testUserWallet: Wallet = { address: 'testAddress' } as Wallet;

  const peerMeta = {
    url: 'testUrl',
    description: 'testDescription',
    name: 'testName',
    icons: ['testIcon'],
  };

  const walletConnectSession = {
    valid: {
      session: {
        accounts: ['0x0000000000000000000000000000000000000001'],
        bridge: 'https://bridge.walletconnect.org',
        chainId: 1,
        connected: true,
        peerMeta: peerMeta,
      },
      wallet: '0x0000000000000000000000000000000000000001',
      chainId: 1,
    },
    invalid: {
      session: {
        accounts: ['0x0000000000000000000000000000000000000001'],
        bridge: 'https://bridge.walletconnect.org',
        chainId: 1,
        connected: false,
        peerMeta: null,
      },
      wallet: '0x0000000000000000000000000000000000000001',
      chainId: 1,
    },
  };

  let service: WalletConnectService;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService> = null;
  let walletConnectSpy: jasmine.SpyObj<WalletConnectService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let alertControllerSpy: any;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  const router = {
    url: '',
  };

  beforeEach(waitForAsync(() => {
    walletConnectSpy = jasmine.createSpyObj('WalletConnect', {
      approveSession: () => Promise.resolve(),
      approveRequest: () => Promise.resolve(),
      rejectRequest: () => Promise.resolve(),
      session: walletConnectSession.valid,
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    storageServiceSpy = jasmine.createSpyObj('AppStorageService', {
      forceRemove: (): void => {},
      remove: Promise.resolve({}),
      set: Promise.resolve({}),
      get: Promise.resolve({}),
    });

    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      sendRawTransaction: () => Promise.resolve(),
      signTypedData: () => Promise.resolve(),
      personalSign: () => Promise.resolve(),
    });

    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve()
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: WalletConnect, useValue: walletConnectSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: AppStorageService, useValue: storageServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(WalletConnectService);
    service.peerMeta = peerMeta;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set uri when setUri is called', () => {
    service.setUri(testUri);
    expect(service.uri.value).toEqual(testUri);
  });

  it('should create a new connector and call subscribe when initWalletConnect is called with an uri', async () => {
    const spySubscribe = spyOn(service, 'subscribeToEvents');
    await service.initWalletConnect(testUri);
    expect(service.walletConnector).toBeDefined();
    expect(spySubscribe).toHaveBeenCalledTimes(1);
  });

  it('should set all info needed when setAccountinfo is called with a wallet object', () => {
    service.setAccountInfo(testWallet);
    expect(service.address).toEqual(testWallet.address);
    expect(service.activeChainId).toEqual(testWallet.chainId);
    expect(service.providerSymbol).toEqual(testWallet.symbol);
    expect(service.rpcUrl).toEqual(testWallet.rpc);
    expect(service.network).toEqual(testWallet.network);
  });

  it('should resolve successfully when checkDappStatus is called and peerMeta data exists', async () => {
    service.peerMeta = peerMeta;
    const res = await service.checkDappStatus();
    expect(res).toBeTruthy();
  });

  it('should reject the promise when checkDappStatus is called and peerMeta data does not exists', async () => {
    service.walletConnector = new WalletConnect({ uri: testUri });
    service.peerMeta = null;
    const spy = spyOn(service, 'killSession');

    try {
      await service.checkDappStatus();
    } catch (e) {
      expect(spy).toHaveBeenCalled();
      expect(e).toEqual('Dapp not responding. Try scanning a new QR code');
    }
  });

  it('should call walletTransactionService sendRawTransaction when checkRequest is called with a sendTransaction request', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    const spy = spyOn(service, 'approveRequest');

    const res = await service.checkRequest(requestSendTransaction, testUserWallet);
    expect(walletTransactionsServiceSpy.sendRawTransaction).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ error: false });
  });

  it('should show in console an error when checkRequest is called with a sendTransaction request and the protocol address is not the same', async () => {
    console.log = jasmine.createSpy('log');
    service.address = '0x00000000003';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(requestSendTransaction, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Error: Address requested does not match active account');
  });

  it('should return an error when checkRequest is called with a sendTransaction request and sendRawTransaction fails', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.sendRawTransaction.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestSendTransaction, testUserWallet);
    expect(res).toEqual({ error: true });
  });

  it('should call walletTransactionService personalSign when checkRequest is called with a personal_sign request', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    const spy = spyOn(service, 'approveRequest');

    const res = await service.checkRequest(requestPersonalSign, testUserWallet);
    expect(walletTransactionsServiceSpy.personalSign).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ error: false });
  });

  it('should show in console an error when checkRequest is called with a personal_sign request and the protocol address is not the same', async () => {
    console.log = jasmine.createSpy('log');
    service.address = '0x00000000003';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(requestPersonalSign, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Error: Address requested does not match active account');
  });

  it('should return an error when checkRequest is called with a personal_sign request and personalSign fails', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.personalSign.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestPersonalSign, testUserWallet);
    expect(res).toEqual({ error: true });
  });

  it('should call walletTransactionService personalSign when checkRequest is called with a eth_sign request', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    const spy = spyOn(service, 'approveRequest');

    const res = await service.checkRequest(requestEthSign, testUserWallet);
    expect(walletTransactionsServiceSpy.personalSign).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ error: false });
  });

  it('should show in console an error when checkRequest is called with a eth_sign request and the protocol address is not the same', async () => {
    console.log = jasmine.createSpy('log');
    service.address = '0x00000000003';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(requestEthSign, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Error: Address requested does not match active account');
  });

  it('should return an error when checkRequest is called with a eth_sign request and personalSign fails', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.personalSign.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestEthSign, testUserWallet);
    expect(res).toEqual({ error: true });
  });

  it('should call walletTransactionService signTypedData when checkRequest is called with a eth_signTypedData request', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    const spy = spyOn(service, 'approveRequest');

    const res = await service.checkRequest(requestTypedData, testUserWallet);

    expect(walletTransactionsServiceSpy.signTypedData).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ error: false });
  });

  it('should show in console an error when checkRequest is called with a eth_signTypedData request and the protocol address is not the same', async () => {
    console.log = jasmine.createSpy('log');
    service.address = '0x00000000003';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));

    await service.checkRequest(requestTypedData, testUserWallet);

    expect(console.log).toHaveBeenCalledWith('Error: Address requested does not match active account');
  });

  it('should return an error when checkRequest is called with a eth_signTypedData request and signTypedData fails', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.signTypedData.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestTypedData, testUserWallet);

    expect(res).toEqual({ error: true });
  });

  it('should show error toast and pop page on invalid eip721 chainId', async () => {
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    service.activeChainId = 1234;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.signTypedData.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestTypedData, testUserWallet);

    expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should show in console an error when checkRequest is called with an unsupported request method', async () => {
    console.log = jasmine.createSpy('log');
    service.address = '0x00000000002';
    service.peerMeta = peerMeta;
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(unsupportedRequestTypedData, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Not supported method: eth_signTypedData_v6');
  });

  it('should navigate to new-connection when disconnect subscription is called and the active route is connection-detail', async () => {
    const spy = spyOn(service, 'killSession');
    router.url = 'wallets/wallet-connect/connection-detail';
    await service.checkActiveScreen();

    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['wallets/wallet-connect/new-connection']);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not navigate when disconnect subscription is called and the active route is no connection-detail', async () => {
    router.url = 'home';
    await service.checkActiveScreen();

    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(0);
  });

  it('should not call isValidURL() when checkDeeplinkUrl is called and this.uri is not defined', async () => {
    const spy = spyOn(service, 'isValidURL');
    service.uri.next(undefined);
    service.checkDeeplinkUrl();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should navigate to new-connection when checkDeeplinkUrl is called and this.uri is a valid url', async () => {
    service.uri.next(testUri);
    const spy = spyOn(service, 'isValidURL').and.returnValue(true);
    service.checkDeeplinkUrl();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/wallet-connect/new-connection']);
  });

  it('should not navigate to new-connection when checkDeeplinkUrl is called and this.uri is a invalid url', async () => {
    service.uri.next('https://');
    const spy = spyOn(service, 'isValidURL').and.returnValue(false);
    service.checkDeeplinkUrl();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should return true when isValidURL() is called with a valid url', () => {
    const res = service.isValidURL(testUri);

    expect(res).toEqual(true);
  });

  it('should return false when isValidURL() is called with a invalid url', () => {
    const res = service.isValidURL('wc:///');

    expect(res).toEqual(false);
  });

  it('should approve a request when approveRequest is called', async () => {
    service.walletConnector = new WalletConnect({ uri: testUri });
    const spy = spyOn(service.walletConnector, 'approveRequest');

    await service.approveRequest(1, {});

    expect(spy).toHaveBeenCalled();
  });

  it('should reject a request when rejectRequest is called', async () => {
    service.walletConnector = new WalletConnect({ uri: testUri });
    const spy = spyOn(service.walletConnector, 'rejectRequest');

    await service.rejectRequest(1);

    expect(spy).toHaveBeenCalled();
  });

  it('should return true when checkIsApproval is called with an approve request', async () => {
    const res = await service.checkIsApproval(approveRequest);

    expect(res).toEqual(true);
  });

  it('should return false when checkIsApproval is called with a swap request', async () => {
    const res = await service.checkIsApproval(swapRequest);

    expect(res).toEqual(false);
  });

  it('should call walletConnect approveSession when approveSession is called', async () => {
    service.walletConnector = new WalletConnect({ uri: testUri });
    const spy = spyOn(service.walletConnector, 'approveSession');
    await service.approveSession();

    expect(spy).toHaveBeenCalled();
  });

  it('should set a walletConnectSession when setWalletConnectSession is called', async () => {
    service.walletConnector = new WalletConnect({ uri: testUri });
    service.address = walletConnectSession.valid.wallet;
    service.activeChainId = walletConnectSession.valid.chainId;

    await service.setWalletConnectSession();

    expect(storageServiceSpy.set).toHaveBeenCalled();
  });

  it('should reconect walletConnect session when retrieveWalletConnect is called and exists an active session', async () => {
    const spyAccountInfo = spyOn(service, 'setAccountInfo');
    const spySubscriptions = spyOn(service, 'subscribeToEvents');
    storageServiceSpy.get.and.returnValue(Promise.resolve(walletConnectSession.valid));
    service.walletConnector = new WalletConnect({ uri: testUri });

    await service.retrieveWalletConnect();

    expect(spyAccountInfo).toHaveBeenCalled();
    expect(spySubscriptions).toHaveBeenCalled();
    expect(service.peerMeta).toEqual(peerMeta);
    expect(service.connected).toEqual(true);
  });

  it('should restore walletConnector to null and remove the session from storage when retrieveWalletConnect is called and peerMeta does not exists', async () => {
    storageServiceSpy.get.and.returnValue(Promise.resolve(walletConnectSession.invalid));

    await service.retrieveWalletConnect();

    expect(service.walletConnector).toEqual(null);
    expect(storageServiceSpy.remove).toHaveBeenCalled();
  });

  it('should return undefined when subscribeToEvents is called and walletConnector is not defined', async () => {
    service.walletConnector = null;
    const res = await service.subscribeToEvents();

    expect(res).toEqual(undefined);
  });

  it('should call the ping function when checkConnection is called and walletConnector is defined', async () => {
    service.walletConnector = new WalletConnect({ uri: testUri });
    const spy = spyOn(service, 'ping');
    await service.checkConnection();
    expect(spy).toHaveBeenCalled();
  });

  it('should remove from storage the walletconnect element when checkConnection is called and walletConnect is not defined', async () => {
    service.walletConnector = null;
    await service.checkConnection();
    expect(storageServiceSpy.forceRemove).toHaveBeenCalled();
  });

  it('should call approveSession when ping is called and walletConnector is defined', async () => {
    service.walletConnector = new WalletConnect({ uri: testUri });
    service.activeChainId = 1;
    service.address = '0x0000000000000000001';
    const spy = spyOn(service.walletConnector, 'approveSession');
    const res = service.ping();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toBeTruthy();
  });

  it('should return an error when ping is called and approveSession returns an error', async () => {
    const error = await service.ping();
    const res = error.toString().includes('TypeError:') && error.toString().includes('approveSession');
    expect(res).toBeTruthy();
  });
});
