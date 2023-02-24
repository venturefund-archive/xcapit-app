import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UrlSerializer } from '@angular/router';
import { ConnectionDetailPage } from './connection-detail.page';
import {
  IPeerMeta,
  WalletConnectService,
} from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { alertControllerMock } from '../../../../../testing/spies/alert-controller-mock.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { WCService } from '../../shared-wallets/services/wallet-connect/wc.service';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/WCUri';
import { rawWalletConnectUriV1, rawWalletConnectUriV2 } from '../../shared-wallets/fixtures/raw-wallet-connect-uri';
import { By } from '@angular/platform-browser';
import { WCConnectionV2 } from '../../shared-wallets/services/wallet-connect/wc-connection-v2';
import { PendingProposal } from '../../shared-wallets/models/wallet-connect/pending-proposal/pending-proposal';
import { rawPeerMetadata } from '../../shared-wallets/fixtures/raw-proposal.fixture';
import { SpyProperty } from 'src/testing/spy-property.spec';

describe('ConnectionDetailPage', () => {
  let component: ConnectionDetailPage;
  let fixture: ComponentFixture<ConnectionDetailPage>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let alertControllerSpy: any;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let wcServiceSpy: jasmine.SpyObj<WCService>;
  let wcConnectionV2Spy: jasmine.SpyObj<WCConnectionV2>;
  let pendingProposalSpy: jasmine.SpyObj<PendingProposal>;
  let peerMetadataV1: IPeerMeta;

  beforeEach(waitForAsync(() => {
    peerMetadataV1 = { url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon'] };
    walletConnectServiceSpy = jasmine.createSpyObj(
      'WalletConnectService',
      { approveSession: Promise.resolve({}), killSession: Promise.resolve({}) },
      {
        connected: false,
        peerMeta: peerMetadataV1,
      }
    );
    navControllerSpy = jasmine.createSpyObj('NavController', {
      pop: Promise.resolve(null),
      navigateBack: Promise.resolve(null),
      navigateForward: Promise.resolve(null),
      navigateRoot: Promise.resolve(null),
    });

    alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    wcServiceSpy = jasmine.createSpyObj('WCService', {
      uri: new WCUri(rawWalletConnectUriV2),
      connected: false,
    });

    pendingProposalSpy = jasmine.createSpyObj('PendingProposal', {
      peerMetadata: rawPeerMetadata,
    });

    wcConnectionV2Spy = jasmine.createSpyObj('WCConnectionV2', {
      proposal: pendingProposalSpy,
      approveSession: Promise.resolve(),
      closeSession: null,
    });

    TestBed.configureTestingModule({
      declarations: [ConnectionDetailPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        UrlSerializer,
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: WCService, useValue: wcServiceSpy },
        { provide: WCConnectionV2, useValue: wcConnectionV2Spy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly when there is a connection', async () => {
    wcServiceSpy.connected.and.returnValue(true);
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    const connectedHelperEl = fixture.debugElement.query(By.css('div.wcdc__connection__connected'));
    const disconnectLinkEl = fixture.debugElement.query(By.css('div.disconnect_link > a'));
    expect(connectedHelperEl).toBeTruthy();
    expect(disconnectLinkEl).toBeTruthy();
  });

  it('should render properly when there is not a connection', async () => {
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    const disconnectedHelperEl = fixture.debugElement.query(By.css('div.wcdc__connection__disconnected'));
    const connectButtonEl = fixture.debugElement.query(By.css('ion-button[name="ux_wc_connect"]'));
    expect(disconnectedHelperEl).toBeTruthy();
    expect(connectButtonEl).toBeTruthy();
  });

  describe('Wallet Connect V2', () => {
    it('should set the template data on ion view will enter and render properly', async () => {
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      const peericonEl = fixture.debugElement.query(By.css('div.wcdc__logo > img'));
      const peerNameEl = fixture.debugElement.query(By.css('div.wcdc__provider_name > ion-label'));
      const [peerUrlEl, peerDescriptionEl] = fixture.debugElement.queryAll(
        By.css('div.wcdc__provider_detail > ion-label')
      );
      expect(peericonEl.attributes.src).toEqual(rawPeerMetadata.icons[0]);
      expect(peerNameEl.nativeElement.innerHTML).toContain(rawPeerMetadata.name);
      expect(peerUrlEl.nativeElement.innerHTML).toContain(`URL: ${rawPeerMetadata.url}`);
      expect(peerDescriptionEl.nativeElement.innerHTML).toContain(rawPeerMetadata.description);
    });

    it('should connect with dapp when user clicks on connect button', async () => {
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('ion-button[name="ux_wc_connect"]')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(wcConnectionV2Spy.approveSession).toHaveBeenCalledTimes(1);
      expect(component.connectionStatus).toBeTruthy();
      expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should show an alert and disconnect from dapp when user clicks on disconnect button and confirm it', async () => {
      wcServiceSpy.connected.and.returnValue(true);
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('div.disconnect_link > a')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      const { buttons } = alertControllerSpy.create.calls.first().args[0];
      await buttons[1].handler();

      expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
      expect(wcConnectionV2Spy.closeSession).toHaveBeenCalledTimes(1);
      expect(component.connectionStatus).toBeFalsy();
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith(['wallets/wallet-connect/new-connection']);
    });
  });

  describe('Wallet Connect V1', () => {
    it('should set the template data on ion view will enter and render properly', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      const peericonEl = fixture.debugElement.query(By.css('div.wcdc__logo > img'));
      const peerNameEl = fixture.debugElement.query(By.css('div.wcdc__provider_name > ion-label'));
      const [peerUrlEl, peerDescriptionEl] = fixture.debugElement.queryAll(
        By.css('div.wcdc__provider_detail > ion-label')
      );
      expect(peericonEl.attributes.src).toEqual(peerMetadataV1.icons[0]);
      expect(peerNameEl.nativeElement.innerHTML).toContain(peerMetadataV1.name);
      expect(peerUrlEl.nativeElement.innerHTML).toContain(`URL: ${peerMetadataV1.url}`);
      expect(peerDescriptionEl.nativeElement.innerHTML).toContain(peerMetadataV1.description);
    });

    it('should kill WC session and navigate back when peer metadata isnt found', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      new SpyProperty(walletConnectServiceSpy, 'peerMeta').value().and.returnValue(null);
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
    });

    it('should connect with dapp when user clicks on connect button', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('ion-button[name="ux_wc_connect"]')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(walletConnectServiceSpy.approveSession).toHaveBeenCalledTimes(1);
      expect(component.connectionStatus).toBeTruthy();
      expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should show an alert and disconnect from dapp when user clicks on disconnect button and confirm it', async () => {
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      wcServiceSpy.connected.and.returnValue(true);
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('div.disconnect_link > a')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      const { buttons } = alertControllerSpy.create.calls.first().args[0];
      await buttons[1].handler();

      expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
      expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
      expect(component.connectionStatus).toBeFalsy();
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith(['wallets/wallet-connect/new-connection']);
    });

    it('should show an error in console when user clicks on disconnect button and it fails', async () => {
      console.log = jasmine.createSpy('log');
      walletConnectServiceSpy.killSession.and.returnValue(Promise.reject('testError'));
      wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
      wcServiceSpy.connected.and.returnValue(true);
      component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('div.disconnect_link > a')).nativeElement.click();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      const { buttons } = alertControllerSpy.create.calls.first().args[0];
      await buttons[1].handler();

      expect(console.log).toHaveBeenCalledWith('Wallet Connect - killSession error: ', 'testError');
    });
  });

  it('should create an error alert when user clicks on connect button and connection fails', async () => {
    walletConnectServiceSpy.approveSession.and.returnValue(Promise.reject());
    wcServiceSpy.uri.and.returnValue(new WCUri(rawWalletConnectUriV1));
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_wc_connect"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should navigate to home when user triggers the back button and walletConnect is connected', () => {
    wcServiceSpy.connected.and.returnValue(true);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-back-button')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tab/home']);
  });

  it('should navigate back when user triggers the back button and walletConnect is disconnected', () => {
    wcServiceSpy.connected.and.returnValue(false);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-back-button')).nativeElement.click();
    expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
  });

  it('should navigate to create a support ticket when supportHelp is called', () => {
    fixture.debugElement.query(By.css('ion-button[name="Support Help"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/tickets/create-support-ticket');
  });

  it('should re-check the connection status on leaving page', () => {
    const spy = spyOn(component, 'checkConnectionStatus');
    component.ionViewDidLeave();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
