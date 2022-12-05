import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ReceivePage } from './receive.page';
import { QRCodeService } from '../../../shared/services/qr-code/qr-code.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ShareService } from '../../../shared/services/share/share.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FormattedNetworkPipe } from 'src/app/shared/pipes/formatted-network-name/formatted-network.pipe';

const testCurrencies: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
  },
  {
    id: 2,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
  },
];

describe('ReceivePage', () => {
  let component: ReceivePage;
  let fixture: ComponentFixture<ReceivePage>;
  let qrCodeServiceMock;
  let qrCodeService: QRCodeService;
  let clipboardServiceSpy : jasmine.SpyObj<ClipboardService>;
  let shareServiceSpy : jasmine.SpyObj<ShareService>;
  let toastServiceMock;
  let walletEncryptionServiceMock;
  let platformServiceSpy;
  let toastService: ToastService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ReceivePage>;
  let activatedRouteMock: any;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoin: testCurrencies[0],
        getNetworks: ['ERC20', 'RSK']
      });
      qrCodeServiceMock = {
        generateQRFromText: () => Promise.resolve('test_qr'),
      };
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', {
        write: Promise.resolve(),
      });
      shareServiceSpy = jasmine.createSpyObj('ShareService', {
        share: Promise.resolve(),
      });
      toastServiceMock = {
        showInfoToast: () => Promise.resolve(),
      };
      walletEncryptionServiceMock = {
        getEncryptedWallet: () => Promise.resolve({ addresses: { ERC20: 'test_address', RSK: 'other_address' } }),
      };
      platformServiceSpy = jasmine.createSpyObj('PlatformService', {
        isNative: true,
      });
      activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['get']);
      activatedRouteMock.snapshot = {
        queryParamMap: convertToParamMap({
          asset: 'ETH',
          network: 'ERC20'
        }),
      };
      TestBed.configureTestingModule({
        declarations: [ReceivePage, FakeTrackClickDirective,FormattedNetworkPipe],
        imports: [
          IonicModule,
          HttpClientTestingModule,
          RouterTestingModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: QRCodeService, useValue: qrCodeServiceMock },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: ShareService, useValue: shareServiceSpy },
          { provide: ToastService, useValue: toastServiceMock },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceMock },
          { provide: PlatformService, useValue: platformServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ReceivePage);
      component = fixture.componentInstance;
      component.address = 'test_address';
      fixture.detectChanges();
      qrCodeService = TestBed.inject(QRCodeService);
      toastService = TestBed.inject(ToastService);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate QR with address on enter page', async () => {
    const spy = spyOn(qrCodeService, 'generateQRFromText').and.callThrough();
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test_address');
    expect(component.addressQr).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#qr-img')));
  });

  it('should copy address when click in copy button', async () => {
    const spyToast = spyOn(toastService, 'showInfoToast').and.callThrough();
    const button = fixture.debugElement.query(By.css('#copy-address-button'));
    await button.nativeElement.click();
    expect(spyToast).toHaveBeenCalledTimes(1);
    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({ string: 'test_address' });
  });

  it('should share address when click in share button - native platform', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const button = fixture.debugElement.query(By.css('#share-address-button'));
    await button.nativeElement.click();
    expect(shareServiceSpy.share).toHaveBeenCalledOnceWith(
      {
        title: 'wallets.receive.share_title',
        dialogTitle: 'wallets.receive.share_title',
        text: 'test_address',
      }
    );
  });

  it('should copy address when click in share button and it fails - native platform', async () => {
    shareServiceSpy.share.and.rejectWith();
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const button = fixture.debugElement.query(By.css('#share-address-button'));
    await button.nativeElement.click();
    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({string: 'test_address'});
  });

  it('should not render share button on no native platform', async () => {
    platformServiceSpy.isNative.and.returnValue(false);
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const button = fixture.debugElement.query(By.css('#share-address-button'));
    expect(button).toBeNull();
  });

  it('should call trackEvent on trackService when Copy Wallet Address is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Copy Wallet Address');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Share Wallet Address is clicked', () => {
    component.isNativePlatform = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Share Wallet Address');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should retrieve user selected asset and networks on ionViewWillEnter', async () => {
    fixture.detectChanges();
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.currency).toEqual(testCurrencies[0]);
    expect(component.networks).toEqual(['ERC20', 'RSK']);
    expect(component.selectedNetwork).toEqual('ERC20');
  });

  it('should change network when network is changed', async () => {
    component.currency = testCurrencies[0];
    component.address = 'test_address';
    component.selectedNetwork = 'ERC20';
    component.networks = ['ERC20', 'RSK'];
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-network-select-card')).triggerEventHandler('networkChanged', 'RSK');
    await fixture.whenStable();
    expect(component.selectedNetwork).toEqual('RSK');
    expect(component.address).toEqual('other_address');
  });

  it('should redirect to coin selection when coin is clicked', async() => {
    component.currency = testCurrencies[0];
    component.address = 'test_address';
    component.selectedNetwork = 'ERC20';
    component.networks = ['ERC20', 'RSK'];
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-coin-selector')).triggerEventHandler('changeCurrency', undefined);
    await fixture.whenStable();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/wallets/receive/select-currency']);
  });
});
