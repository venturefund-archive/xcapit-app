import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UrlSerializer } from '@angular/router';
import { ConnectionDetailPage } from './connection-detail.page';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { alertControllerMock } from '../../../../../testing/spies/alert-controller-mock.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ConnectionDetailPage', () => {
  let component: ConnectionDetailPage;
  let fixture: ComponentFixture<ConnectionDetailPage>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let alertControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
        connected: false,
        peerMeta: { url: 'testUrl', description: 'testDescription', name: 'testName', icons: ['testIcon'] },
        approveSession: Promise.resolve({}),
        killSession: Promise.resolve({}),
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = jasmine.createSpyObj('NavController', {
        pop: Promise.resolve(null),
        navigateBack: Promise.resolve(null),
        navigateForward: Promise.resolve(null),
        navigateRoot: Promise.resolve(null),
      });

      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

      TestBed.configureTestingModule({
        declarations: [ConnectionDetailPage],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          UrlSerializer,
          { provide: WalletConnectService, useValue: walletConnectServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: AlertController, useValue: alertControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ConnectionDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should excecute checkProtocolInfo and checkConnectionStatus on ionViewWillEnter', () => {
    const spyProtocolInfo = spyOn(component, 'checkProtocolInfo');
    const spyConnectionStatus = spyOn(component, 'checkConnectionStatus');
    component.ionViewWillEnter();
    expect(spyProtocolInfo).toHaveBeenCalledTimes(1);
    expect(spyConnectionStatus).toHaveBeenCalledTimes(1);
  });

  it('should get peerMeta info from walletConnect peerMeta when checkProtocolInfo is called', () => {
    component.checkProtocolInfo();
    expect(component.peerMeta).toEqual(walletConnectServiceSpy.peerMeta);
  });

  it('should call killSession from walletConnect and call backNavigate when checkProtocolInfo is called and walletConnect peerMeta is null', async () => {
    const spy = spyOn(component, 'backNavigation');
    walletConnectServiceSpy.peerMeta = null;
    fixture.detectChanges();
    component.checkProtocolInfo();
    await fixture.whenStable();
    expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to /tab/home when backNavigation is called and walletConnect is connected', () => {
    walletConnectServiceSpy.connected = true;
    fixture.detectChanges();
    component.backNavigation();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tab/home']);
  });

  it('should navigate back when backNavigation is called and walletConnect is disconnected', () => {
    walletConnectServiceSpy.connected = false;
    fixture.detectChanges();
    component.backNavigation();
    expect(navControllerSpy.pop).toHaveBeenCalledTimes(1);
  });

  it('should set connectionStatus when checkConnectionStatus is called', () => {
    walletConnectServiceSpy.connected = false;
    fixture.detectChanges();
    component.checkConnectionStatus();
    expect(component.connectionStatus).toBeFalsy();
  });

  it('should call walletConnect approveSession and set connectionStatus to true when approveSession is called', async () => {
    component.approveSession();
    await fixture.whenStable();
    expect(walletConnectServiceSpy.approveSession).toHaveBeenCalledTimes(1);
    expect(component.connectionStatus).toBeTruthy();
  });

  it('should create an error alert when approveSession is called and walletConnet approveSession fails', async () => {
    walletConnectServiceSpy.approveSession.and.returnValue(Promise.reject());
    fixture.detectChanges();
    component.approveSession();
    await fixture.whenStable();
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call walletConnect killSession, set false connectionStatus and navigate to wallets/wallet-connect/new-connection when killSession is called', async () => {
    component.killSession();
    await fixture.whenStable();
    expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
    expect(component.connectionStatus).toBeFalsy();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith(['wallets/wallet-connect/new-connection']);
  });

  it('should shows in console an error when killSession is called and fails', async () => {
    console.log = jasmine.createSpy('log');
    walletConnectServiceSpy.killSession.and.returnValue(Promise.reject('testError'));
    component.killSession();
    await fixture.whenStable();
    expect(console.log).toHaveBeenCalledWith('Wallet Connect - killSession error: ', 'testError');
  });

  it('should show an alert when disconnectSession is called', async () => {
    component.disconnectSession();
    await fixture.whenStable();
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call killSession when is pressed Terminate button on disconnection alert', async () => {
    const spy = spyOn(component, 'killSession');
    component.disconnectSession();
    await fixture.whenStable();
    const { buttons } = alertControllerSpy.create.calls.first().args[0];
    await buttons[1].handler();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to create a support ticket when supportHelp is called', () => {
    component.supportHelp();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/tickets/create-support-ticket');
  })
});
