import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReceivePage } from './receive.page';
import { QRCodeService } from '../../../shared/services/qr-code/qr-code.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ShareService } from '../../../shared/services/share/share.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../../shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';

const testCurrencies: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: true,
    value: 'ETH',
    network: 'ERC20',
    rpc: 'http://testrpc.test/',
  },
];

describe('ReceivePage', () => {
  let component: ReceivePage;
  let fixture: ComponentFixture<ReceivePage>;
  let qrCodeServiceMock;
  let qrCodeService: QRCodeService;
  let clipboardServiceMock;
  let clipboardService: ClipboardService;
  let shareServiceMock;
  let shareService: ShareService;
  let toastServiceMock;
  let walletEncryptionService: WalletEncryptionService;
  let walletEncryptionServiceMock;
  let toastService: ToastService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ReceivePage>;

  beforeEach(
    waitForAsync(() => {
      qrCodeServiceMock = {
        generateQRFromText: () => Promise.resolve('test_qr'),
      };
      clipboardServiceMock = {
        write: () => Promise.resolve(),
      };
      shareServiceMock = {
        share: () => Promise.resolve(),
      };
      toastServiceMock = {
        showToast: () => Promise.resolve(),
      };
      walletEncryptionServiceMock = {
        getEncryptedWallet: () => Promise.resolve({ addresses: { ERC20: 'test_address' } }),
      };
      TestBed.configureTestingModule({
        declarations: [ReceivePage, TrackClickDirective],
        imports: [
          IonicModule,
          ReactiveFormsModule,
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([]),
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: QRCodeService, useValue: qrCodeServiceMock },
          { provide: ClipboardService, useValue: clipboardServiceMock },
          { provide: ShareService, useValue: shareServiceMock },
          { provide: ToastService, useValue: toastServiceMock },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ReceivePage);
      component = fixture.componentInstance;
      component.address = 'test_address';
      component.currencies = testCurrencies;
      fixture.detectChanges();
      qrCodeService = TestBed.inject(QRCodeService);
      clipboardService = TestBed.inject(ClipboardService);
      shareService = TestBed.inject(ShareService);
      toastService = TestBed.inject(ToastService);
      walletEncryptionService = TestBed.inject(WalletEncryptionService);
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
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test_address');
    expect(component.addressQr).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#qr-img')));
  });

  it('should copy address when click in copy button', async () => {
    const spyToast = spyOn(toastService, 'showToast').and.callThrough();
    const spy = spyOn(clipboardService, 'write').and.callThrough();
    const button = fixture.debugElement.query(By.css('#copy-address-button'));
    await button.nativeElement.click();
    expect(spyToast).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ string: 'test_address' });
  });

  it('should share address when click in share button', async () => {
    const spy = spyOn(shareService, 'share').and.callThrough();
    const button = fixture.debugElement.query(By.css('#share-address-button'));
    await button.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      {
        title: 'wallets.receive.share_title',
        dialogTitle: 'wallets.receive.share_title',
        text: 'test_address',
      },
      'shared.services.share.share_error'
    );
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
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Share Wallet Address');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
