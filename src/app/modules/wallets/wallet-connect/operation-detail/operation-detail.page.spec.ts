import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, ModalController, AlertController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UrlSerializer } from '@angular/router';
import { OperationDetailPage } from './operation-detail.page';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { alertControllerMock } from '../../../../../testing/spies/alert-controller-mock.spec';
import { ethers } from 'ethers';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeConnectedWallet } from '../../../../../testing/fakes/wallet.fake.spec';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

const requestSendTransaction = {
  method: 'eth_sendTransaction',
  params: [
    {
      gas: '21000',
      value: '5'
    }
  ]
};

const requestSign = {
  method: 'personal_sign',
  params: ['0x48656c6c6f20576f726c64', '0x48656c6c6f20576f726c64']
}

const requestTypedData = {
  method: 'eth_signTypedData_v4',
  params:['', '{"types":{},"domain":{"name":"Test"},"primaryType":"TestRequest","message":{"target":"0x00000000001","gasData":{"gasLimit":"21000","gasPrice":"1700000000"}}}']
}

describe('OperationDetailPage', () => {
  let component: OperationDetailPage;
  let fixture: ComponentFixture<OperationDetailPage>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let alertControllerSpy: any;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService> = null;
  let connectedWalletSpy;
  let fakeConnectedWallet: FakeConnectedWallet;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(
    waitForAsync(() => {
      walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { 
        connected: false,
        peerMeta: {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']},
        providerSymbol: 'ETH',
        requestInfo: requestSendTransaction,
        getTransactionType: Promise.resolve(null),
        getGasPrice: Promise.resolve(ethers.BigNumber.from('10')),
        killSession: Promise.resolve({}),
        rejectRequest: Promise.resolve({}),
        network: 'ETH',
        rpcUrl: 'https://rpc_test.com/',
        checkRequest: Promise.resolve({error: false})
      });
      
      fakeNavController = new FakeNavController();
      navControllerSpy = jasmine.createSpyObj('NavController', {
        pop: Promise.resolve(null)
      });

      fakeModalController = new FakeModalController({ data: 'fake_password' });
      modalControllerSpy = fakeModalController.createSpy();

      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

      fakeConnectedWallet = new FakeConnectedWallet();
      connectedWalletSpy = fakeConnectedWallet.createSpy();

      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getDecryptedWalletForNetwork: Promise.resolve(jasmine.createSpyObj('Wallet', { connect: () => connectedWalletSpy })),
      });

      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showErrorToast: Promise.resolve(),
      });

      TestBed.configureTestingModule({
        declarations: [OperationDetailPage],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          UrlSerializer,
          { provide: WalletConnectService, useValue: walletConnectServiceSpy},
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: AlertController, useValue: alertControllerSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(OperationDetailPage);
      component = fixture.componentInstance;
      component.peerMeta = null;
      component.providerSymbol = '';
      component.transactionDetail = null;
      component.loadingText = '';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkProtocolInfo on ionViewWillEnter', () => {
    const spy = spyOn(component, 'checkProtocolInfo');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call walletConnect killSession when checkProtocolInfo is called and walletConnect peerMeta is null', async () => {
    walletConnectServiceSpy.peerMeta = null;
    fixture.detectChanges();
    component.checkProtocolInfo();
    await fixture.whenStable();
    expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
  });

  it('should asign all the data needed, call checkRequestInfo and getActualDateTime when checkProtocolInfo is called and walletConnect peerMate is not null', async () => {
    const spyCheckRequestInfo = spyOn(component, 'checkRequestInfo');
    const spyGetActualDateTime = spyOn(component, 'getActualDateTime');
    component.checkProtocolInfo();
    await fixture.whenStable();
    expect(component.peerMeta).toEqual(walletConnectServiceSpy.peerMeta);
    expect(component.providerSymbol).toEqual(walletConnectServiceSpy.providerSymbol);
    expect(component.transactionDetail).toEqual(walletConnectServiceSpy.requestInfo);
    expect(spyCheckRequestInfo).toHaveBeenCalledTimes(1);
    expect(spyGetActualDateTime).toHaveBeenCalledTimes(1);
  });

  it('should asign totalFeeAmount when getTotalFeeAmount is called', async () => {
    component.getTotalFeeAmount('21000');
    await fixture.whenStable();
    expect(component.totalFeeAmount).toEqual('0.00000000000021');
  });

  it('should call getTotalFeeAmount when checkRequestInfo is called with a sendTransaction method', async () => {
    const spy = spyOn(component, 'getTotalFeeAmount');
    component.checkRequestInfo(requestSendTransaction);
    await fixture.whenStable();
    expect(walletConnectServiceSpy.getTransactionType).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should decode the message to sign when checkRequestInf is called with a personal_sign method', () => {
    component.checkRequestInfo(requestSign);
    expect(component.message).toEqual('Hello World');
  });

  it('should decode the message to sign when checkRequestInf is called with a eth_sign method', () => {
    requestSign.method = 'eth_sign';
    fixture.detectChanges();
    component.checkRequestInfo(requestSign);
    expect(component.message).toEqual('Hello World');
  });

  it('should call htmlFormatParse when checkRequestInfo is called with any eth_signTypedData method', () => {
    const spy = spyOn(component, 'htmlFormatParse');
    component.checkRequestInfo(requestTypedData);
    expect(spy).toHaveBeenCalledTimes(1);
  })

  it('should open confirmation modal when confirmOperation is called', async () => {
    component.confirmOperation();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should create an alert when cancelOperation is called', async () => {
    component.cancelOperation();
    await fixture.whenStable();
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call walletConnect rejectTransaction and navigate back when cancelOperation is called and the alert is confirmed', async () => {
    component.transactionDetail = {id: 1};
    fixture.detectChanges();
    component.cancelOperation();
    await fixture.whenStable();
    const { buttons } = alertControllerSpy.create.calls.first().args[0];
    await buttons[1].handler();
    expect(walletConnectServiceSpy.rejectRequest).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
  });

  it('should call setLoadingText when confirmOperation is called', async () => {
    const spy = spyOn(component, 'setLoadingText');
    component.confirmOperation();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set the loadingText to sign_loading when setLoadingText and isSignRequest is true', async () => {
    await component.setLoadingText();
    expect(component.loadingText).toEqual('wallets.wallet_connect.operation_detail.sign_loading');
  });

  it('should set the loadingText to approve_loading when setLoadingText and isApproval is true', async () => {
    component.isSignRequest = false;
    component.isApproval = true;
    fixture.detectChanges();
    await component.setLoadingText();
    expect(component.loadingText).toEqual('wallets.wallet_connect.operation_detail.approve_loading');
  });

  it('should set the loadingText to confirmation_loading when setLoadingText and isSignRequest and isApproval are false', async () => {
    component.isSignRequest = false;
    component.isApproval = false;
    fixture.detectChanges();
    await component.setLoadingText();
    expect(component.loadingText).toEqual('wallets.wallet_connect.operation_detail.confirmation_loading');
  });

  it('should call decryptedWallet function when confirmOperation is called', async () => {
    const spy = spyOn(component, 'decryptedWallet');
    await component.confirmOperation();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call showAlertTxError when checkRequest returns an error', async () => {
    walletConnectServiceSpy.checkRequest.and.returnValues(Promise.resolve({error: true}));
    fixture.detectChanges();
    await component.confirmOperation();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('should show error toast when decryptedWallet is called and getDecryptedWalletFroNetwork fails', async () => {
    walletEncryptionServiceSpy.getDecryptedWalletForNetwork.and.returnValue(Promise.reject());
    fixture.detectChanges();
    await component.decryptedWallet('1234');
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'wallets.wallet_connect.operation_detail.password_error',
    });
  });

  it('should dismiss the modal when is pressed accept button on showAlertTxError', async () => {
    walletConnectServiceSpy.checkRequest.and.returnValues(Promise.resolve({error: true}));
    fixture.detectChanges();
    await component.confirmOperation();
    const button: any = alertControllerSpy.create.calls.first().args[0].buttons[0];
    await button.handler();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
