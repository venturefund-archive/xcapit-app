import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, ModalController, AlertController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UrlSerializer } from '@angular/router';
import { OperationDetailPage } from './operation-detail.page';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { alertControllerMock } from '../../../../../testing/spies/alert-controller-mock.spec';
import { ethers } from 'ethers';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeConnectedWallet } from '../../../../../testing/fakes/wallet.fake.spec';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { rawWalletConnectUriV1, rawWalletConnectUriV2 } from '../../shared-wallets/fixtures/raw-wallet-connect-uri';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/WCUri';
import { SessionRequestInjectable } from 'src/app/shared/models/wallet-connect/session-request/injectable/session-request-injectable';
import { RequestMethod } from 'src/app/shared/models/wallet-connect/request-method/request-method';
import { WCSession } from '../../../../shared/models/wallet-connect/wc-session/wc-session';
import { rawPeerMetadata } from '../../shared-wallets/fixtures/raw-proposal.fixture';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawEthereumData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { rawPersonalSignRequest } from '../../shared-wallets/fixtures/raw-wallet-connect-requests';
import { SpyProperty } from '../../../../../testing/spy-property.spec';
import { SimpleSubject } from 'src/app/shared/models/simple-subject/simple-subject';
import { WCConnectionV2 } from '../../shared-wallets/services/wallet-connect/wc-connection-v2/wc-connection-v2';
import { WCService } from '../../shared-wallets/services/wallet-connect/wc-service/wc.service';
import { SignClientV2 } from '../../../../shared/models/wallet-connect/sign-client/sign-client';
import { NullRequest } from '../../../../shared/models/wallet-connect/session-request/null-request/null-request';
import { FakeRequest } from '../../../../shared/models/wallet-connect/session-request/fake-request/fake-request';
import { HtmlOf } from '../../../../shared/models/wallet-connect/html-of/html-of';
import { HtmlContentOf } from '../../../../shared/models/wallet-connect/html-content-of/html-content-of';

const requestSendTransaction = {
  method: 'eth_sendTransaction',
  params: [
    {
      gas: '21000',
      value: '5',
    },
  ],
};

const requestTypedData = {
  method: 'eth_signTypedData_v4',
  params: [
    '',
    '{"types":{},"domain":{"name":"Test"},"primaryType":"TestRequest","message":{"target":"0x00000000001","gasData":{"gasLimit":"21000","gasPrice":"1700000000"}}}',
  ],
};
describe('OperationDetailPage', () => {
  let component: OperationDetailPage;
  let fixture: ComponentFixture<OperationDetailPage>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let alertControllerSpy: any;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService> = null;
  let connectedWalletSpy;
  let fakeConnectedWallet: FakeConnectedWallet;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationDetailPage>;
  let wcServiceSpy: jasmine.SpyObj<WCService>;
  let requestMethodSpy: jasmine.SpyObj<RequestMethod>;
  let sessionRequestInjectableSpy: jasmine.SpyObj<SessionRequestInjectable>;
  let walletSpy: jasmine.SpyObj<Wallet>;
  let wcSessionSpy: jasmine.SpyObj<WCSession>;
  let wcConnectionV2Spy: jasmine.SpyObj<WCConnectionV2>;
  let requestSign: any;
  let onNeedPassSubject: SimpleSubject;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;

  beforeEach(waitForAsync(() => {
    requestSign = {
      method: 'personal_sign',
      params: ['0x48656c6c6f20576f726c64', '0x48656c6c6f20576f726c64'],
    };
    walletConnectServiceSpy = jasmine.createSpyObj(
      'WalletConnectService',
      {
        getTransactionType: Promise.resolve(null),
        getGasPrice: Promise.resolve(ethers.BigNumber.from('100000000')),
        killSession: Promise.resolve({}),
        rejectRequest: Promise.resolve({}),
        checkRequest: Promise.resolve({ error: false }),
      },
      {
        connected: false,
        peerMeta: { url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon'] },
        requestInfo: requestSendTransaction,
        providerSymbol: 'ETH',
        rpcUrl: 'https://rpc_test.com/',
        network: 'ETH',
      }
    );

    navControllerSpy = jasmine.createSpyObj('NavController', {
      pop: Promise.resolve(null),
    });

    fakeModalController = new FakeModalController({ data: 'fake_password' });
    modalControllerSpy = fakeModalController.createSpy();

    alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

    fakeConnectedWallet = new FakeConnectedWallet();
    connectedWalletSpy = fakeConnectedWallet.createSpy();

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getDecryptedWalletForNetwork: Promise.resolve(
        jasmine.createSpyObj('Wallet', { connect: () => connectedWalletSpy })
      ),
    });

    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
    });

    wcServiceSpy = jasmine.createSpyObj('WCService', {
      connected: true,
      uri: new WCUri(rawWalletConnectUriV2),
    });

    requestMethodSpy = jasmine.createSpyObj('RequestMethod', {
      isSignRequest: true,
    });

    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      respond: Promise.resolve(),
    });

    sessionRequestInjectableSpy = jasmine.createSpyObj('SessionRequestInjectable', {
      request: new FakeRequest(rawPersonalSignRequest),
    });

    onNeedPassSubject = new SimpleSubject();

    walletSpy = jasmine.createSpyObj('Wallet', {
      blockchain: new Blockchain(rawEthereumData),
      onNeedPass: onNeedPassSubject,
    });

    wcSessionSpy = jasmine.createSpyObj('WCSession', {
      peerMetadata: rawPeerMetadata,
      wallet: walletSpy,
    });

    wcConnectionV2Spy = jasmine.createSpyObj('WCConnectionV2', {
      session: wcSessionSpy,
    });

    TestBed.configureTestingModule({
      declarations: [OperationDetailPage, FakeTrackClickDirective, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        UrlSerializer,
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: WCService, useValue: wcServiceSpy },
        { provide: SessionRequestInjectable, useValue: sessionRequestInjectableSpy },
        { provide: WCConnectionV2, useValue: wcConnectionV2Spy },
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

    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track ux_wc_sign when button is clicked and is a sign operation', async () => {
    wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
    spyOn(component, 'checkProtocolInfo');
    component.isApproval = false;
    component.isSignRequest = true;
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-button.ux_button'));
    const directive = trackClickDirectiveHelper.getDirective(buttonEl);
    const spy = spyOn(directive, 'clickEvent');
    buttonEl.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(directive.dataToTrack.eventLabel).toEqual('ux_wc_sign');
  });

  it('should track ux_wc_confirm when button is clicked and is a confirmation operation', async () => {
    wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-button.ux_button'));
    const directive = trackClickDirectiveHelper.getDirective(buttonEl);
    const spy = spyOn(directive, 'clickEvent');
    buttonEl.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(directive.dataToTrack.eventLabel).toEqual('ux_wc_confirm');
  });

  it('should track ux_wc_approve when button is clicked and is an approval operation', () => {
    wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
    spyOn(component, 'checkProtocolInfo');
    component.isSignRequest = false;
    component.isApproval = true;
    component.ionViewWillEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button.ux_button'));
    const directive = trackClickDirectiveHelper.getDirective(buttonEl);
    const spy = spyOn(directive, 'clickEvent');
    buttonEl.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(directive.dataToTrack.eventLabel).toEqual('ux_wc_approve');
  });

  it('should set the loadingText to sign_loading when setLoadingText and isSignRequest is true', async () => {
    component.setLoadingText();
    expect(component.loadingText).toEqual('wallets.wallet_connect.operation_detail.sign_loading');
  });

  it('should set the loadingText to approve_loading when setLoadingText and isApproval is true', async () => {
    component.isSignRequest = false;
    component.isApproval = true;
    fixture.detectChanges();
    component.setLoadingText();
    expect(component.loadingText).toEqual('wallets.wallet_connect.operation_detail.approve_loading');
  });

  it('should set the loadingText to confirmation_loading when setLoadingText and isSignRequest and isApproval are false', async () => {
    component.isSignRequest = false;
    component.isApproval = false;
    fixture.detectChanges();
    component.setLoadingText();
    expect(component.loadingText).toEqual('wallets.wallet_connect.operation_detail.confirmation_loading');
  });

  describe('Wallet Connect V2', () => {
    it('should set templateData on ionViewWillEnter', async () => {
      await component.ionViewWillEnter();

      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      const peerNameEl = fixture.debugElement.query(By.css('div.wcod__provider_name > ion-label'));
      const peerIconEl = fixture.debugElement.query(By.css('div.wcod__logo > img'));
      expect(peerNameEl.nativeElement.innerHTML).toContain(rawPeerMetadata.name);
      expect(peerIconEl.attributes.src).toEqual(rawPeerMetadata.icons[0]);
    });

    it('should show the message to sign if its a sign request', async () => {
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      const signRequestEl = fixture.debugElement.query(By.css('app-sign-request'));
      expect(signRequestEl.nativeElement.message).toEqual(new HtmlOf('My email is john@doe.com - 1678769188349').value());
      expect(signRequestEl.nativeElement.dateInfo).toBeTruthy();
    });

    it('should not show message if request has an unsupported request method', async () => {
      sessionRequestInjectableSpy.request.and.returnValue(new NullRequest());
      await component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      const signRequestEl = fixture.debugElement.query(By.css('app-sign-request'));
      expect(signRequestEl).toBeFalsy();
    });

    it('should go back if the app isnt connected to a peer', async () => {
      wcServiceSpy.connected.and.returnValue(false);
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
    });

    it('should reject the transaction and navigate back when user cancels the operation and the alert is confirmed', async () => {
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      component.cancelOperation();

      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      const { buttons } = alertControllerSpy.create.calls.first().args[0];
      await buttons[1].handler();
      expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
    });

    it('should confirm the operation and navigate back when user clicks on confirm operation', async () => {
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('div.wcod__button_section > ion-button')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
    });

    it('should show error toast on confirmation when password is incorrect', async () => {
      sessionRequestInjectableSpy.request.and.returnValue(new FakeRequest(rawPersonalSignRequest, Promise.reject()));
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('div.wcod__button_section > ion-button')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
      const button: any = alertControllerSpy.create.calls.first().args[0].buttons[0];
      await button.handler();
      expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Wallet Connect V1', () => {
    it('should set templateData on ionViewWillEnter', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      const peerNameEl = fixture.debugElement.query(By.css('div.wcod__provider_name > ion-label'));
      const peerIconEl = fixture.debugElement.query(By.css('div.wcod__logo > img'));
      expect(peerNameEl.nativeElement.innerHTML).toContain('testName');
      expect(peerIconEl.attributes.src).toEqual('testIcon');
    });

    it('should close session when peer metadata is not found on ion view will enter', async () => {
      wcServiceSpy.connected.and.returnValue(false);
      new SpyProperty(walletConnectServiceSpy, 'peerMeta').value().and.returnValue(null);
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
    });

    it('should show the fee amount on request different than sign requests (transactions)', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      const feeAmountEl = fixture.debugElement.query(
        By.css('div.wcod__transaction_detail__container__content > ion-label')
      );
      expect(walletConnectServiceSpy.getTransactionType).toHaveBeenCalledTimes(1);
      expect(walletConnectServiceSpy.getGasPrice).toHaveBeenCalledTimes(1);
      expect(feeAmountEl.nativeElement.innerHTML).toContain('0.0000021 ETH');
    });

    it('should show the message to sign when the request is a personal sign request', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      new SpyProperty(walletConnectServiceSpy, 'requestInfo').value().and.returnValue(requestSign);

      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      const signRequestEl = fixture.debugElement.query(By.css('app-sign-request'));
      expect(signRequestEl.nativeElement.message).toEqual(new HtmlOf('Hello World').value());
      expect(signRequestEl.nativeElement.dateInfo).toBeTruthy();
    });

    it('should show the message to sign when the request is a eth sign request', async () => {
      requestSign.method = 'eth_sign';
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      new SpyProperty(walletConnectServiceSpy, 'requestInfo').value().and.returnValue(requestSign);

      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      const signRequestEl = fixture.debugElement.query(By.css('app-sign-request'));
      expect(signRequestEl.nativeElement.message).toEqual(new HtmlOf('Hello World').value());
    });

    it('should reject the transaction and navigate back when user cancels the operation and the alert is confirmed', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      component.transactionDetail = { id: 1 };
      fixture.detectChanges();
      fixture.debugElement.query(By.css('div.disconnect_link > a')).nativeElement.click();
      await fixture.whenStable();
      const { buttons } = alertControllerSpy.create.calls.first().args[0];
      await buttons[1].handler();
      expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
      expect(walletConnectServiceSpy.rejectRequest).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
    });

    it('should confirm the operation and navigate back when user clicks on confirm operation', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));

      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('div.wcod__button_section > ion-button')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(walletEncryptionServiceSpy.getDecryptedWalletForNetwork).toHaveBeenCalledTimes(1);
      expect(walletConnectServiceSpy.checkRequest).toHaveBeenCalledTimes(1);
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
    });

    it('should show error toast on confirmation when password is incorrect', async () => {
      walletEncryptionServiceSpy.getDecryptedWalletForNetwork.and.returnValue(Promise.reject());
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));

      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('div.wcod__button_section > ion-button')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
        message: 'wallets.wallet_connect.operation_detail.password_error',
      });
    });

    it('should call htmlFormatParse when checkRequestInfo is called with any eth_signTypedData method', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      new SpyProperty(walletConnectServiceSpy, 'requestInfo').value().and.returnValue(requestTypedData);
      const messageDiv = document.createElement('div');
      messageDiv.id = 'message';
      const documentSpy = spyOn(document, 'getElementById');
      documentSpy.and.returnValue(messageDiv);

      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      const jsonParams = JSON.parse(requestTypedData.params[1]);
      delete jsonParams.types;
      expect(component.message).toEqual(new HtmlContentOf(jsonParams).value())
    });

    it('should show an alert of error when confirmation of request returns an error and it can be dismissed', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      walletConnectServiceSpy.checkRequest.and.returnValues(Promise.resolve({ error: true }));
      fixture.detectChanges();
      await component.confirmOperation();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(alertControllerSpy.create).toHaveBeenCalled();
      const button: any = alertControllerSpy.create.calls.first().args[0].buttons[0];
      await button.handler();
      expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
