import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CameraPlugin, Photo } from '@capacitor/camera';
import { FilesystemPlugin } from '@capacitor/filesystem';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TEST_COINS } from '../../wallets/shared-wallets/constants/coins.test';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { PurchaseOrderPage } from './purchase-order.page';
import { FakeAppStorage } from '../../../shared/services/app-storage/app-storage.service';
import { IonicStorageService } from '../../../shared/services/ionic-storage/ionic-storage.service';

describe('PurchaseOrderPage', () => {
  let component: PurchaseOrderPage;
  let fixture: ComponentFixture<PurchaseOrderPage>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let clipboardInfoSpy: jasmine.SpyObj<any>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let cameraSpy: jasmine.SpyObj<CameraPlugin>;
  let filesystemSpy: jasmine.SpyObj<FilesystemPlugin>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let kriptonStorageServiceSpy: jasmine.SpyObj<KriptonStorageService>;
  let fakeAppStorage: FakeAppStorage;

  const photo: Photo = {
    dataUrl: 'assets/img/coins/ETH.svg',
    format: '',
    saved: true,
  };

  const testOperation = {
    operation_id: 678,
    operation_type: 'cash-in',
    status: 'request',
    currency_in: 'ARS',
    amount_in: 500.0,
    currency_out: 'USDC',
    amount_out: 100.0,
    created_at: new Date('2021-02-27T10:02:49.719Z'),
    provider: '1',
    voucher: false,
    wallet_address: '0xeeeeeeeee',
  };

  beforeEach(waitForAsync(() => {
    cameraSpy = jasmine.createSpyObj('Camera', {
      requestPermissions: Promise.resolve(),
      getPhoto: Promise.resolve(photo),
    });

    filesystemSpy = jasmine.createSpyObj('Filesystem', {
      requestPermissions: Promise.resolve(),
    });

    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getCoin: TEST_COINS[0] });
    fakeActivatedRoute = new FakeActivatedRoute({ step: '1' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    clipboardInfoSpy = jasmine.createSpyObj(
      'clipboardInfoSpy',
      {},
      {
        value: 'KriptonMarket.alias',
        modalText: 'fiat_ramps.shared.kripton_account_info.alias',
      }
    );

    kriptonStorageServiceSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve('test@test.com'),
    });

    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', { write: Promise.resolve() });

    storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
      getData: {
        amount_in: '7274.994150004679',
        amount_out: '20.20833325',
        country: 'Argentina',
        currency_in: 'ars',
        currency_out: 'MATIC',
        network: 'MATIC',
        price_in: '1',
        operation_id: 676,
        price_out: '359.9997120002304',
        provider: '1',
        type: 'cash-in',
        wallet: '0xd148c6735e1777be439519b32a1a6ef9c8853934',
      },
      getVoucher: undefined,
      cleanVoucher: null,
      updateVoucher: null,
    });

    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showInfoToast: Promise.resolve(),
    });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      confirmCashInOperation: of({}),
      getUserSingleOperation: of([testOperation]),
    });

    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: true,
    });

    fakeAppStorage = new FakeAppStorage();

    TestBed.configureTestingModule({
      declarations: [PurchaseOrderPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ClipboardService, useValue: clipboardServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: StorageOperationService, useValue: storageOperationServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageServiceSpy },
        { provide: IonicStorageService, useValue: fakeAppStorage },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderPage);
    component = fixture.componentInstance;
    component.cameraPlugin = cameraSpy;
    component.filesystemPlugin = filesystemSpy;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get currency out on ionViewWillEnter', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.currencyOut).toEqual(TEST_COINS[0]);
  });

  it('should get step on ionViewWillEnter and render transfer on step 1', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-text.po__title__primary'));
    const transferEl = fixture.debugElement.query(By.css('app-kripton-account-info-card'));
    const voucherEl = fixture.debugElement.query(By.css('app-voucher-card'));

    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.title');
    expect(transferEl).toBeTruthy();
    expect(voucherEl).toBeNull();
    expect(component.isFirstStep).toBeTrue();
  });

  it('should get step on ionViewWillEnter and render voucher on step 2', async () => {
    fakeActivatedRoute.modifySnapshotParams({ step: '2' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-text.po__title__primary'));
    const transferEl = fixture.debugElement.query(By.css('app-kripton-account-info-card'));
    const voucherEl = fixture.debugElement.query(By.css('app-voucher-card'));

    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.title_2');
    expect(transferEl).toBeNull();
    expect(voucherEl).toBeTruthy();
    expect(component.isFirstStep).toBeFalse();
  });

  it('should render properly', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const headerTitleEl = fixture.debugElement.query(By.css('ion-title.po__header'));
    const titleEl = fixture.debugElement.query(By.css('ion-text.po__title__primary'));
    const subtitleEl = fixture.debugElement.query(By.css('ion-text.po__title__subtitle'));
    const providerTitleEl = fixture.debugElement.query(By.css('div.po__provider ion-text'));
    const kriptonAccountEl = fixture.debugElement.query(By.css('app-kripton-account-info-card'));
    const purchaseInfoEl = fixture.debugElement.query(By.css('app-kripton-purchase-info'));
    const timerCountDownEl = fixture.debugElement.query(By.css('app-timer-countdown'));

    expect(headerTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.header');
    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.subtitle');
    expect(providerTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.provider');
    expect(kriptonAccountEl).toBeTruthy();
    expect(timerCountDownEl).toBeTruthy();
    expect(purchaseInfoEl).toBeTruthy();
  });

  it('should copy alias and show toast when copyValue event is triggered', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-kripton-account-info-card'))
      .triggerEventHandler('copyValue', clipboardInfoSpy);
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({ string: clipboardInfoSpy.value });
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledOnceWith({
      message: 'fiat_ramps.purchase_order.clipboard_text',
    });
  });

  it('should go to next step when user clicks Continue button', () => {
    fixture.debugElement.query(By.css('ion-button[name="Continue"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/purchase-order/2'], {
      animated: false,
    });
  });

  it('should add photo on addPhoto', async () => {
    storageOperationServiceSpy.getVoucher.and.returnValues(undefined, photo);
    fakeActivatedRoute.modifySnapshotParams({ step: '2' });
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    await component.addPhoto();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(cameraSpy.getPhoto).toHaveBeenCalledTimes(1);
    expect(storageOperationServiceSpy.updateVoucher).toHaveBeenCalledOnceWith(photo);
    expect(component.voucher).toEqual(photo);
    expect(component.percentage).toEqual(100);
  });

  it('should remove photo on removePhoto', async () => {
    fakeActivatedRoute.modifySnapshotParams({ step: '2' });
    await component.ionViewWillEnter();
    component.percentage = 100;
    component.voucher = photo;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-voucher-card')).triggerEventHandler('removePhoto', null);
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    expect(storageOperationServiceSpy.updateVoucher).toHaveBeenCalledOnceWith(undefined);
    expect(component.voucher).toEqual(undefined);
    expect(component.percentage).toEqual(-1);
  });

  it('should send photo and show success modal when simplified wallet', async () => {
    kriptonStorageServiceSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageServiceSpy.get.withArgs('access_token').and.resolveTo('test');
    const expectedData = { file: photo.dataUrl, email: 'test@test.com', auth_token: 'test' };
    fakeActivatedRoute.modifySnapshotParams({ step: '2' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    component.percentage = 100;
    component.voucher = photo;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_upload_photo"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(fiatRampsServiceSpy.confirmCashInOperation).toHaveBeenCalledOnceWith(
      component.data.operation_id,
      expectedData
    );
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(storageOperationServiceSpy.cleanVoucher).toHaveBeenCalledTimes(1);
  });

  it('should send photo and navigate to tabs wallet when not simplified wallet', async () => {
    await fakeAppStorage.set('warranty_wallet', true);
    kriptonStorageServiceSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageServiceSpy.get.withArgs('access_token').and.resolveTo('test');
    const expectedData = { file: photo.dataUrl, email: 'test@test.com', auth_token: 'test' };
    fakeActivatedRoute.modifySnapshotParams({ step: '2' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    component.percentage = 100;
    component.voucher = photo;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_upload_photo"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(fiatRampsServiceSpy.confirmCashInOperation).toHaveBeenCalledOnceWith(
      component.data.operation_id,
      expectedData
    );
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/tabs/wallets');
    expect(storageOperationServiceSpy.cleanVoucher).toHaveBeenCalledTimes(1);
  });

  it('should send photo and navigate to error when finish button is clicked', async () => {
    kriptonStorageServiceSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageServiceSpy.get.withArgs('access_token').and.resolveTo('test');
    const expectedData = { file: photo.dataUrl, email: 'test@test.com', auth_token: 'test' };
    fiatRampsServiceSpy.confirmCashInOperation.and.returnValue(throwError('Test'));
    fakeActivatedRoute.modifySnapshotParams({ step: '2' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    component.percentage = 100;
    component.voucher = photo;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_upload_photo"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(fiatRampsServiceSpy.confirmCashInOperation).toHaveBeenCalledOnceWith(
      component.data.operation_id,
      expectedData
    );
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/error-operation-km']);
    expect(storageOperationServiceSpy.cleanVoucher).toHaveBeenCalledTimes(1);
  });

  it('should clean voucher data if navigate back and is first step', async () => {
    fakeActivatedRoute.modifySnapshotParams({ step: '1' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-back-button')).nativeElement.click();
    expect(storageOperationServiceSpy.cleanVoucher).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.back).toHaveBeenCalledTimes(1);
  });
});
