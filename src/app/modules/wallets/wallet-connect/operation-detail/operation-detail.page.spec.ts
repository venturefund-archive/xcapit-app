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

  beforeEach(
    waitForAsync(() => {
      walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { 
        connected: false,
        peerMeta: {url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon']},
        providerSymbol: 'ETH',
        requestInfo: requestSendTransaction,
        checkIsApproval: Promise.resolve(false),
        getGasPrice: Promise.resolve(ethers.BigNumber.from('10')),
        killSession: Promise.resolve({}),
        rejectRequest: Promise.resolve({})
      });
      
      fakeNavController = new FakeNavController();
      navControllerSpy = jasmine.createSpyObj('NavController', {
        pop: Promise.resolve(null)
      });

      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

      TestBed.configureTestingModule({
        declarations: [OperationDetailPage],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          UrlSerializer,
          { provide: WalletConnectService, useValue: walletConnectServiceSpy},
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: AlertController, useValue: alertControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(OperationDetailPage);
      component = fixture.componentInstance;
      component.peerMeta = null;
      component.providerSymbol = '';
      component.transactionDetail = null;
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

  it('should asign totalFeeAmount and totalAmount when getTotalAmount is called', async () => {
    component.getTotalAmount('21000', '5');
    await fixture.whenStable();
    expect(component.totalFeeAmount).toEqual('0.00000000000021');
    expect(component.totalAmount).toEqual('0.000000000000000005');
  });

  it('should call getTotalAmount when checkRequestInfo is called with a sendTransaction method', async () => {
    const spy = spyOn(component, 'getTotalAmount');
    component.checkRequestInfo(requestSendTransaction);
    await fixture.whenStable();
    expect(walletConnectServiceSpy.checkIsApproval).toHaveBeenCalledTimes(1);
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

  it('should call walletConnect rejectOperation and navigate back when confirmOperation id called and modal returns data equal true', async () => {
    fakeModalController.modifyReturns({},{data: true});
    component.transactionDetail = {id: 1};
    fixture.detectChanges();
    await component.confirmOperation();
    expect(walletConnectServiceSpy.rejectRequest).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
  });

  it('should not call walletConnect rejectOperation neither navigate back when confirmOperation id called and modal returns data equal true', async () => {
    fakeModalController.modifyReturns({},{data: undefined});
    await component.confirmOperation();
    expect(walletConnectServiceSpy.rejectRequest).toHaveBeenCalledTimes(0);
    expect(navControllerSpy.pop).toHaveBeenCalledTimes(0);
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

});
