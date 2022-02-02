import { TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController, AlertController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { WalletTransactionsService } from '../../services/wallet-transactions/wallet-transactions.service';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import WalletConnect from '@walletconnect/client';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { alertControllerMock } from '../../../../../../testing/spies/alert-controller-mock.spec';
import { WalletConnectService } from './wallet-connect.service';
import { ethers, Wallet } from 'ethers';

const testUri = 'wc:2a57d842-7977-4de0-ac22-0dd57bc326a6@1?bridge=https%3A%2F%2Fb.bridge.walletconnect.org&key=70f7fa5486706b77377a5672e6d45c0d19b9b12f6a44d80928a9f0eac5629392';

const testWallet = {
  address: '0x00000000000001',
  chainId: 1,
  symbol: 'ETH',
  rpc: 'https://testRpc',
  network: 'ERC20'
}

const requestSendTransaction = {
  method: 'eth_sendTransaction',
  params: [
    {
      gas: '21000',
      value: '5',
      from: '0x00000000002',
      data: ''
    }
  ]
};

const requestPersonalSign = {
  method: 'personal_sign',
  params: ['0x48656c6c6f20576f726c64', '0x00000000002']
}

const requestEthSign = {
  method: 'eth_sign',
  params: ['0x00000000002', '0x48656c6c6f20576f726c64']
}

const requestTypedData = {
  method: 'eth_signTypedData',
  params:['0x00000000002', '{"types":{},"domain":{"name":"Test"},"primaryType":"TestRequest","message":{"target":"0x00000000001","gasData":{"gasLimit":"21000","gasPrice":"1700000000"}}}']
}

const unsupportedRequestTypedData = {
  method: 'eth_signTypedData_v6',
  params:['0x00000000002', '{"types":{},"domain":{"name":"Test"},"primaryType":"TestRequest","message":{"target":"0x00000000001","gasData":{"gasLimit":"21000","gasPrice":"1700000000"}}}']
}

const testUserWallet: Wallet = { address: 'testAddress' } as Wallet;

describe('WalletConnectService', () => {
  let service: WalletConnectService;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService> = null;
  let walletConnectSpy: jasmine.SpyObj<WalletConnectService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let alertControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      walletConnectSpy = jasmine.createSpyObj('WalletConnect', {
        approveSession: () => Promise.resolve()
      })

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      storageServiceSpy = jasmine.createSpyObj('AppStorageService', {
        remove: Promise.resolve({}),
      });

      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

      walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
        sendRawTransaction: () => Promise.resolve(),
        signTypedData: () => Promise.resolve(),
        personalSign: () => Promise.resolve()
      });

      TestBed.configureTestingModule({
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
          { provide: WalletConnect, useValue: walletConnectSpy },
          { provide: AlertController, useValue: alertControllerSpy },
          { provide: AppStorageService, useValue: storageServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    service = TestBed.inject(WalletConnectService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set uri when setUri is called', () => {
    service.setUri(testUri);
    expect(service.uri).toEqual(testUri);
  });

  it('should return when checkConnection is called and is connected', async () => {
    service.walletConnector = new WalletConnect({uri: testUri});
    const spy = spyOn(service, 'ping').and.returnValue(Promise.resolve(true));
    await service.checkConnection();
    expect(service.walletConnector).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call appStorageService remove when checkConnection is called and walletConnector does not existe', async () => {
    await service.checkConnection();
    expect(storageServiceSpy.remove).toHaveBeenCalledTimes(1);
  });

  it('should call appStorageService remove when chackConnection is called and WalletConnector exists but is disconnected', async () => {
    service.walletConnector = new WalletConnect({uri: testUri});
    spyOn(service, 'ping').and.returnValue(Promise.resolve(false));
    await service.checkConnection();
    expect(storageServiceSpy.remove).toHaveBeenCalledTimes(1);
  });

  it('should resolve without errors the promise when ping is called and walletConnector approveSession success', async () => {
    service.walletConnector = new WalletConnect({uri: testUri});
    service.activeChainId = 1;
    service.address = '0x0000000000000000001';
    const spy = spyOn(service.walletConnector, 'approveSession');
    service.ping();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should resolve with errors the promise when ping is called and walletConnector approveSession fails', async () => {
    const error = await service.ping();
    const res = error.toString().includes('TypeError:') && error.toString().includes('approveSession')
    expect(res).toBeTruthy();
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
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    const res = await service.checkDappStatus();
    expect(res).toBeTruthy();
  });

  it('should call walletTransactionService sendRawTransaction when checkRequest is called with a sendTransaction request', async () => {
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    const spy = spyOn(service, 'approveRequest');

    const res = await service.checkRequest(requestSendTransaction, testUserWallet);
    expect(walletTransactionsServiceSpy.sendRawTransaction).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ error: false });
  });

  it('should show in console an error when checkRequest is called with a sendTransaction request and the protocol address is not the same', async () => {
    console.log = jasmine.createSpy("log");
    service.address = '0x00000000003';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(requestSendTransaction, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Error: Address requested does not match active account');
  });

  it('should return an error when checkRequest is called with a sendTransaction request and sendRawTransaction fails', async () => {
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.sendRawTransaction.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestSendTransaction, testUserWallet);
    expect(res).toEqual({ error: true });
  });

  it('should call walletTransactionService personalSign when checkRequest is called with a personal_sign request', async () => {
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    const spy = spyOn(service, 'approveRequest');

    const res = await service.checkRequest(requestPersonalSign, testUserWallet);
    expect(walletTransactionsServiceSpy.personalSign).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ error: false });
  });

  it('should show in console an error when checkRequest is called with a personal_sign request and the protocol address is not the same', async () => {
    console.log = jasmine.createSpy("log");
    service.address = '0x00000000003';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(requestPersonalSign, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Error: Address requested does not match active account');
  });

  it('should return an error when checkRequest is called with a personal_sign request and personalSign fails', async () => {
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.personalSign.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestPersonalSign, testUserWallet);
    expect(res).toEqual({ error: true });
  });

  it('should call walletTransactionService personalSign when checkRequest is called with a eth_sign request', async () => {
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    const spy = spyOn(service, 'approveRequest');

    const res = await service.checkRequest(requestEthSign, testUserWallet);
    expect(walletTransactionsServiceSpy.personalSign).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ error: false });
  });

  it('should show in console an error when checkRequest is called with a eth_sign request and the protocol address is not the same', async () => {
    console.log = jasmine.createSpy("log");
    service.address = '0x00000000003';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(requestEthSign, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Error: Address requested does not match active account');
  });

  it('should return an error when checkRequest is called with a eth_sign request and personalSign fails', async () => {
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.personalSign.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestEthSign, testUserWallet);
    expect(res).toEqual({ error: true });
  });

  it('should call walletTransactionService signTypedData when checkRequest is called with a eth_signTypedData request', async () => {
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    const spy = spyOn(service, 'approveRequest');

    const res = await service.checkRequest(requestTypedData, testUserWallet);
    expect(walletTransactionsServiceSpy.signTypedData).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ error: false });
  });

  it('should show in console an error when checkRequest is called with a eth_signTypedData request and the protocol address is not the same', async () => {
    console.log = jasmine.createSpy("log");
    service.address = '0x00000000003';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(requestTypedData, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Error: Address requested does not match active account');
  });

  it('should return an error when checkRequest is called with a eth_signTypedData request and signTypedData fails', async () => {
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    walletTransactionsServiceSpy.signTypedData.and.returnValue(Promise.reject());

    const res = await service.checkRequest(requestTypedData, testUserWallet);
    expect(res).toEqual({ error: true });
  });

  it('should show in console an error when checkRequest is called with an unsupported request method', async () => {
    console.log = jasmine.createSpy("log");
    service.address = '0x00000000002';
    service.peerMeta = {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']};
    spyOn(service, 'getGasPrice').and.returnValue(Promise.resolve(ethers.BigNumber.from('21000')));
    await service.checkRequest(unsupportedRequestTypedData, testUserWallet);
    expect(console.log).toHaveBeenCalledWith('Not supported method: eth_signTypedData_v6');
  });
});
