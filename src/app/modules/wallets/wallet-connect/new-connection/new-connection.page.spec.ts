import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, ModalController, AlertController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UrlSerializer } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NewConnectionPage } from './new-connection.page';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { alertControllerMock } from '../../../../../testing/spies/alert-controller-mock.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

const provider = {
  name: 'ETH',
  short_name: 'eth',
  chain: 'ERC20',
  network: 'testnet',
  logo: 'TestLogo',
  chain_id: 1,
  network_id: 1,
  rpc_url: 'TestRPC',
  native_currency: {
    symbol: 'ETH',
    name: 'Ether',
    decimals: '18',
  },
}

const walletInfo = {
  address: '0x00000000001',
  network: 'ERC20',
  chainId: 1,
  name: 'ETH',
  logo: 'TestLogo',
  symbol: 'ETH',
  rpc: 'TestRPC'
}

const testWallet = {
  name: 'ETH',
  address: '0x00000000001'
}

const formData = {
  valid: {
    wallet: 1,
    uri: 'wc:test&bridge='
  },
  invalid: {
    wallet: null,
    uri: null
  }
}

describe('NewConnectionPage', () => {
  let component: NewConnectionPage;
  let fixture: ComponentFixture<NewConnectionPage>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let alertControllerSpy: any;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(
    waitForAsync(() => {
      walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { 
        connected: false,
        setAccountInfo: Promise.resolve({}),
        initWalletConnect: Promise.resolve({}),
        checkDappStatus: Promise.resolve(true),
        approveSession: Promise.resolve({}),
        killSession: Promise.resolve({})
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getWalletsAddresses: Promise.resolve({ERC20: '0x00000000001'}),
      });

      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showErrorToast: Promise.resolve(),
      });

      TestBed.configureTestingModule({
        declarations: [NewConnectionPage],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          UrlSerializer,
          { provide: WalletConnectService, useValue: walletConnectServiceSpy},
          { provide: NavController, useValue: navControllerSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: AlertController, useValue: alertControllerSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(NewConnectionPage);
      component = fixture.componentInstance;
      component.isNative = true;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should excecute isConnected on ionViewWillEnter', () => {
    const spy = spyOn(component, 'isConnected').and.callThrough();
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to connection detail when isConnected is called and WalletConnect is connected', () => {
    walletConnectServiceSpy.connected = true;
    fixture.detectChanges();
    component.isConnected();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith(['wallets/wallet-connect/connection-detail']);
  });

  it('should excecute setWalletsInfo when isConnected is called and WalletConnect is disconnected', () => {
    walletConnectServiceSpy.connected = false;
    fixture.detectChanges();
    const spy = spyOn(component, 'setWalletsInfo');
    component.isConnected();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open QR modal when openQRScanner is called', async () => {
    fakeModalController.modifyReturns({}, { data: 'wc:fakeUri@bridge=fakeBridge', role: 'success' });
    component.walletsList = [walletInfo];
    fixture.detectChanges()
    component.openQRScanner();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should set the selected wallet to selectedWallet variable when setWalletInfo is called', () => {
    component.setWalletInfo(testWallet);
    fixture.detectChanges();
    expect(component.selectedWallet).toEqual(testWallet);
  });

  it('should initWalletConnect connect when initWallet is excecuted and form is valid', async () => {
    const spy = spyOn(component, 'initWalletConnect');
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    component.initWallet();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('form should be invalid when some fields are null', () => {
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    component.initWallet();
    expect(component.form.valid).toBeFalsy();
  });

  it('should call walletConnect approveSession when approveSession is excecuted', async () => {
    component.approveSession();
    await fixture.whenStable();
    expect(walletConnectServiceSpy.approveSession).toHaveBeenCalledTimes(1);
    expect(component.connected).toBeTruthy();
  });

  it('should call walletConnect killSession when disconnectSession is excecuted', async () => {
    component.disconnectSession();
    await fixture.whenStable();
    expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
    expect(component.connected).toBeFalsy();
  });

  it('should call walletConnect killSession when killSession is excecuted', async () => {
    component.killSession();
    await fixture.whenStable();
    expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
  });

  it('should navigate to connection-detail when initWalletConnect is excecuted', async () => {
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    await component.initWalletConnect();
    expect(walletConnectServiceSpy.setAccountInfo).toHaveBeenCalledTimes(1);
    expect(walletConnectServiceSpy.initWalletConnect).toHaveBeenCalledTimes(1);
    expect(walletConnectServiceSpy.checkDappStatus).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/wallet-connect/connection-detail']);
  });

  it('should show an error alert when walletConnect setAccountInfo fails', async () => {
    const spy = spyOn(component, 'killSession');
    walletConnectServiceSpy.setAccountInfo.and.returnValue(Promise.reject());
    await component.initWalletConnect();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show an error alert when walletConnect initWalletConnect fails', async () => {
    const spy = spyOn(component, 'killSession');
    walletConnectServiceSpy.initWalletConnect.and.returnValue(Promise.reject());
    await component.initWalletConnect();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show an error alert when walletConnect checkDappStatus fail', async () => {
    const spy = spyOn(component, 'killSession');
    walletConnectServiceSpy.checkDappStatus.and.returnValue(Promise.reject());
    await component.initWalletConnect();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should load the wallestList when setWalletsInfo is excecuted', async () => {
    component.providers = [provider];
    fixture.detectChanges();
    component.setWalletsInfo();
    await fixture.whenStable();
    expect(component.walletsList).toEqual([walletInfo]);
  });

  it('should patchValue to form uri when handleScanRsult is called and the role is success', () => {
    component.handleScanResult('wc:fakeUri@bridge=fakeBridge', 'success');

    expect(component.form.value.uri).toEqual('wc:fakeUri@bridge=fakeBridge');
  });

  it('should call showErrorToast when handleScanRsult is called and the role is unauthorized', () => {
    const spy = spyOn(component, 'showErrorToast');
    component.handleScanResult('wc:fakeUri@bridge=fakeBridge', 'unauthorized');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call showErrorToast when handleScanRsult is called and the data is not valid', () => {
    const spy = spyOn(component, 'showErrorToast');
    component.handleScanResult('wc:fakeUri', 'success');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show error toast when showErrorToas is called', () => {
    component.showErrorToast('fakeMessage');
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should navigate to create-ticket-support when supportHelp is called', () => {
    component.supportHelp();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tickets/create-support-ticket');
  });
});
