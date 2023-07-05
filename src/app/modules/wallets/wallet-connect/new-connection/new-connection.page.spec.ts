import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, ModalController, AlertController, Platform } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
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
import { of, BehaviorSubject } from 'rxjs';
import { rawWalletConnectUriV2, rawWalletConnectUriV1 } from '../../shared-wallets/fixtures/raw-wallet-connect-uri';
import { DefaultWCUri } from 'src/app/shared/models/wallet-connect/wc-uri/default/default-wc-uri';
import { By } from '@angular/platform-browser';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { WCWallet } from '../../shared-wallets/models/wallet-connect/wc-wallet.type';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { WCConnectionV2 } from '../../shared-wallets/services/wallet-connect/wc-connection-v2/wc-connection-v2';
import { WCService } from '../../shared-wallets/services/wallet-connect/wc-service/wc.service';
import { RemoteConfigService } from '../../../../shared/services/remote-config/remote-config.service';
import { FakeWallet } from '../../../swaps/shared-swaps/models/wallet/fake/fake-wallet';

const formData = {
  valid: {
    wallet: 1,
    uri: 'wc:test&bridge=',
  },
  invalid: {
    wallet: null,
    uri: null,
  },
};

const selectedWallet = {
  address: '0x00000000001',
  network: 'ERC20',
  chainId: 4,
  name: 'Ethereum Testnet',
  logo: 'assets/img/blockchains/ethereum.svg',
  symbol: 'ETH',
  rpc: 'https://eth-kovan.alchemyapi.io/v2/tfmomSigQreoKgOjz0W9W-j5SdtKkiZN',
  dataToTrack: 'ux_wc_eth',
} as WCWallet;

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
  let platformSpy: jasmine.SpyObj<Platform>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let wcServiceSpy: jasmine.SpyObj<WCService>;
  let wcConnectionV2: jasmine.SpyObj<WCConnectionV2>;
  let walletsFactorySpy: jasmine.SpyObj<any | WalletsFactory>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let fakeWallet: FakeWallet;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(waitForAsync(() => {
    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
      uri: new BehaviorSubject(null),
      setUri: null,
      connected: false,
      setAccountInfo: Promise.resolve({}),
      initWalletConnect: Promise.resolve({}),
      checkDappStatus: Promise.resolve(true),
      approveSession: Promise.resolve({}),
      killSession: Promise.resolve({}),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve({ ERC20: '0x00000000001' }),
    });

    platformSpy = jasmine.createSpyObj(
      'Platform',
      {},
      {
        backButton: of({}),
      }
    );
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
    });
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true,
    });
    wcServiceSpy = jasmine.createSpyObj('WCService', {
      connected: false,
      uri: new DefaultWCUri(rawWalletConnectUriV2),
      set: null,
    });

    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: true,
    });

    wcConnectionV2 = jasmine.createSpyObj('WCConnectionV2', {
      pairTo: Promise.resolve(),
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: {
        oneById: () => {
          return new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('ERC20');
        },
      },
    });

    fakeWallet = new FakeWallet();

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(fakeWallet) },
    });

    TestBed.configureTestingModule({
      declarations: [NewConnectionPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        UrlSerializer,
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: WCService, useValue: wcServiceSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        { provide: WCConnectionV2, useValue: wcConnectionV2 },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NewConnectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to connection detail on ion view will enter and WC is connected', () => {
    wcServiceSpy.connected.and.returnValue(true);
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith(['wallets/wallet-connect/connection-detail']);
  });

  it('should initialize page on ion view will enter and WC is disconnected', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const walletRadioButtonEl = fixture.debugElement.query(
      By.css('div.wcnc__radio_group > ion-radio-group > div.container > ion-item > ion-label')
    );
    const uriInput = fixture.debugElement.query(
      By.css('div.wcnc__qr_input > ion-item > ion-input[formControlName="uri"]')
    );
    const qrIconEl = fixture.debugElement.query(By.css('div.wcnc__qr_input > ion-item > ion-icon.qr-code'));
    expect(walletRadioButtonEl.nativeElement.innerHTML).toContain('Ethereum Testnet');
    expect(uriInput.nativeElement.value).toEqual(rawWalletConnectUriV2);
    expect(qrIconEl).toBeTruthy();
  });

  it('should open QR modal when user click on qr icon and should set the uri when is successful', async () => {
    fakeModalController.modifyReturns({}, { data: 'wc:fakeUri@bridge=fakeBridge', role: 'success' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.wcnc__qr_input > ion-item > ion-icon.qr-code')).nativeElement.click();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.form.value.uri).toEqual('wc:fakeUri@bridge=fakeBridge');
  });

  it('should show an error toast when QR scan is unauthorized', async () => {
    fakeModalController.modifyReturns({}, { data: 'wc:fakeUri@bridge=fakeBridge', role: 'unauthorized' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.wcnc__qr_input > ion-item > ion-icon.qr-code')).nativeElement.click();
    await fixture.whenStable();

    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'wallets.wallet_connect.scan_qr.errors.permissionDenied',
    });
  });

  it('should show an error toast when a uri is scanned but is not valid', async () => {
    fakeModalController.modifyReturns({}, { data: 'wc:fakeUri', role: 'success' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.wcnc__qr_input > ion-item > ion-icon.qr-code')).nativeElement.click();
    await fixture.whenStable();

    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'wallets.wallet_connect.scan_qr.errors.invalidQR',
    });
  });

  it('should navigate to create-ticket-support when supportHelp is called', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Support Help"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tickets/create-support-ticket');
  });

  describe('Wallet Connect V1', () => {
    it('should connect and redirect to connection detail when a valid form is submitted and the connection is successful', async () => {
      wcServiceSpy.uri.and.returnValue(new DefaultWCUri(rawWalletConnectUriV1));
      walletConnectServiceSpy.uri = new BehaviorSubject<any>(rawWalletConnectUriV1);
      await component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      component.form.patchValue({ wallet: selectedWallet });
      component.setWalletInfo(selectedWallet);

      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(walletConnectServiceSpy.setAccountInfo).toHaveBeenCalledOnceWith(selectedWallet);
      expect(walletConnectServiceSpy.initWalletConnect).toHaveBeenCalledOnceWith(rawWalletConnectUriV1);
      expect(walletConnectServiceSpy.checkDappStatus).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/wallet-connect/connection-detail']);
    });

    it('should show an error alert when connection fail', async () => {
      walletConnectServiceSpy.initWalletConnect.and.rejectWith('error');
      wcServiceSpy.uri.and.returnValue(new DefaultWCUri(rawWalletConnectUriV1));
      walletConnectServiceSpy.uri = new BehaviorSubject<any>(rawWalletConnectUriV1);
      await component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      component.form.patchValue({ wallet: selectedWallet });
      component.setWalletInfo(selectedWallet);

      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(alertControllerSpy.create).toHaveBeenCalledOnceWith({
        header: 'wallets.wallet_connect.init_wallet.errors.header',
        message: 'wallets.wallet_connect.init_wallet.errors.message',
        cssClass: 'ux-alert-small-text',
        buttons: [
          {
            text: 'wallets.wallet_connect.init_wallet.errors.close_button',
            role: 'cancel',
            cssClass: 'ux-link-xs',
          },
        ],
      });
      expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('Wallet Connect V2', () => {
    it('should connect and redirect to connection detail when a valid form is submitted and the connection is successful', async () => {
      const wcUri = new DefaultWCUri(rawWalletConnectUriV2);
      wcServiceSpy.uri.and.returnValue(wcUri);
      await component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      component.form.patchValue({ wallet: selectedWallet });
      component.setWalletInfo(selectedWallet);

      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(wcConnectionV2.pairTo).toHaveBeenCalledOnceWith(wcUri, fakeWallet, '2317188f59a2c8068100b0177bf03ec6da490d0cd829f10ca7eb099785fed709');
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/wallet-connect/connection-detail']);
    });

    it('should show invalid uri error message when v2 is disabled', async () => {
      remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
      const wcUri = new DefaultWCUri(rawWalletConnectUriV2);
      wcServiceSpy.uri.and.returnValue(wcUri);
      await component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      component.form.patchValue({ wallet: selectedWallet });
      component.setWalletInfo(selectedWallet);

      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(wcConnectionV2.pairTo).not.toHaveBeenCalled();
      expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
      expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
        message: 'wallets.wallet_connect.errors.invalidUri',
      });
    });

    it('should show an error alert when connection fail', async () => {
      wcConnectionV2.pairTo.and.rejectWith('error');
      wcServiceSpy.uri.and.returnValue(new DefaultWCUri(rawWalletConnectUriV2));
      await component.ionViewWillEnter();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      component.form.patchValue({ wallet: selectedWallet });
      component.setWalletInfo(selectedWallet);

      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();

      expect(alertControllerSpy.create).toHaveBeenCalledOnceWith({
        header: 'wallets.wallet_connect.init_wallet.errors.header',
        message: 'wallets.wallet_connect.init_wallet.errors.message',
        cssClass: 'ux-alert-small-text',
        buttons: [
          {
            text: 'wallets.wallet_connect.init_wallet.errors.close_button',
            role: 'cancel',
            cssClass: 'ux-link-xs',
          },
        ],
      });
    });
  });

  it('should not try to connect if the form is invalid', async () => {
    const spy = spyOn<any>(component, 'initWalletConnect');
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });
});
