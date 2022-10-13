import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync, discardPeriodicTasks, flush } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { OperationsDetailPage } from './operations-detail.page';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { TEST_ERC20_COINS } from '../../wallets/shared-wallets/constants/coins.test';
import { OperationStatus } from '../shared-ramps/interfaces/operation-status.interface';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { By } from '@angular/platform-browser';
import { CameraPlugin } from '@capacitor/camera';
import { FilesystemPlugin } from '@capacitor/filesystem';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';

const operation: FiatRampOperation = {
  operation_id: 678,
  operation_type: 'cash-in',
  status: 'cancel',
  currency_in: 'ARS',
  amount_in: 500.0,
  currency_out: 'USDT',
  amount_out: 100.0,
  created_at: new Date('2021-02-27T10:02:49.719Z'),
  provider: '1',
  voucher: false,
};

const mappedOperation: OperationDataInterface = {
  type: operation.operation_type,
  amount_in: operation.amount_in.toString(),
  amount_out: operation.amount_out.toString(),
  currency_in: operation.currency_in,
  currency_out: operation.currency_out,
  price_in: '1',
  price_out: '5',
  wallet: operation.wallet_address,
  provider: operation.provider,
  voucher: operation.voucher,
  operation_id: operation.operation_id,
  network: 'ERC20',
};

const coin: Coin = TEST_ERC20_COINS[2];

const provider = rawProvidersData[1];

const operationStatus: OperationStatus = {
  providerId: provider.id,
  provider: provider,
  name: 'complete',
  textToShow: 'deposited',
  colorCssClass: 'success'
};

const photo = {
  dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD==',
  type: 'jpeg',
};

describe('OperationsDetailPage', () => {
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let component: OperationsDetailPage;
  let fixture: ComponentFixture<OperationsDetailPage>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let cameraSpy: jasmine.SpyObj<CameraPlugin>;
  let filesystemSpy: jasmine.SpyObj<FilesystemPlugin>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsDetailPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  

  beforeEach(
    waitForAsync(() => {
      platformServiceSpy = jasmine.createSpyObj('PlatformSpy', {isNative: true });
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        getProvider: provider,
        getUserSingleOperation: of([operation]),
        confirmOperation: of({}),
        setProvider: null,
        getOperationStatus: operationStatus,
      });

      fakeActivatedRoute = new FakeActivatedRoute({
        operation_id: operation.operation_id.toString(),
        provider_id: operation.provider,
      });
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoin: coin,
      });

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      browserServiceSpy = jasmine.createSpyObj('BrowserService', {
        open: Promise.resolve(),
      });

      cameraSpy = jasmine.createSpyObj('Camera', {
        requestPermissions: Promise.resolve(),
        getPhoto: Promise.resolve(photo),
      });
      
      filesystemSpy = jasmine.createSpyObj('Filesystem', {
        requestPermissions: Promise.resolve(),
      });

      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{
        trackEvent: Promise.resolve(true),
      })

      TestBed.configureTestingModule({
        declarations: [OperationsDetailPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          IonicModule.forRoot(),
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: PlatformService, useValue: platformServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
          { provide: TrackService, useValue: trackServiceSpy},
          { provide: ModalController, useValue: modalControllerSpy }
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(OperationsDetailPage);
      component = fixture.componentInstance;
      component.cameraPlugin = cameraSpy;
      component.filesystemPlugin = filesystemSpy;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);

    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user operation on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fiatRampsServiceSpy.getUserSingleOperation).toHaveBeenCalledTimes(1);
    expect(component.operation).toEqual(mappedOperation);
    expect(component.coin).toEqual(coin);
    expect(component.operationStatus).toEqual(operationStatus);
    expect(component.voucherUploadedOnKripton).toEqual(false);
  });

  it('should navigate to operations list if operations does not exists', async () => {
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(throwError('Error'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/fiat-ramps/select-provider']);
  });

  it('should only show ux_buy_kripton_attach when there is no voucher', () => {
    component.operation = mappedOperation;
    component.voucherUploadedOnKripton = false;
    component.voucher = undefined;
    fixture.detectChanges();
    const addButtonEl = fixture.debugElement.query(By.css('ion-button[name="ux_buy_kripton_attach"]'));
    const uploadButtonEl = fixture.debugElement.query(By.css('ion-button[name="ux_upload_photo"]'));
    expect(addButtonEl).toBeTruthy();
    expect(uploadButtonEl).toBeNull();
  });

  it('should only show ux_upload_photo when there is voucher', () => {
    component.operation = mappedOperation;
    component.voucherUploadedOnKripton = false;
    component.voucher = photo;
    fixture.detectChanges();
    const addButtonEl = fixture.debugElement.query(By.css('ion-button[name="ux_buy_kripton_attach"]'));
    const uploadButtonEl = fixture.debugElement.query(By.css('ion-button[name="ux_upload_photo"]'));
    expect(addButtonEl).toBeNull();
    expect(uploadButtonEl).toBeTruthy();
  });

  it('should upload photo when user clicks ux_buy_kripton_attach button', async () => {
    component.ionViewWillEnter();
    component.operation = mappedOperation;
    component.voucherUploadedOnKripton = false;
    component.voucher = undefined;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_buy_kripton_attach"]')).nativeElement.click();
    await fixture.whenStable();
    expect(cameraSpy.requestPermissions).toHaveBeenCalledTimes(1);
    expect(filesystemSpy.requestPermissions).toHaveBeenCalledTimes(1);
    expect(cameraSpy.getPhoto).toHaveBeenCalledTimes(1);
    expect(component.voucher).toEqual(photo);
    expect(component.voucherUploadedOnKripton).toBeFalse();
  });

  it('should call confirmOperation when user clicks ux_upload_photo button with a voucher image', async () => {
    const formData = new FormData();
    formData.append('file', photo.dataUrl);
    component.operation = mappedOperation;
    component.voucherUploadedOnKripton = false;
    component.voucher = photo;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_upload_photo"]')).nativeElement.click();
    await fixture.whenStable();
    expect(fiatRampsServiceSpy.confirmOperation).toHaveBeenCalledOnceWith(mappedOperation.operation_id, formData);
    expect(component.voucher).toBeUndefined();
    expect(component.voucherUploadedOnKripton).toBeTrue();
    expect(component.uploadingVoucher).toBeFalse();
  });

  it('should remove photo on when user clicks remove photo button', async () => {
    fakeModalController.modifyReturns(null, {data: 'secondaryAction'})
    component.ionViewWillEnter()
    component.operation = mappedOperation;
    component.voucherUploadedOnKripton = true;
    component.voucher = photo;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-voucher-card')).triggerEventHandler('removePhoto', null);  
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(component.voucher).toBeUndefined();
    expect(component.voucherUploadedOnKripton).toBeTrue();
    });

  it('should redirect to Kripton ToS when user clicks ux_goto_kripton_tos button', () => {
    const url = {
      url: 'https://kriptonmarket.com/terms-and-conditions',
    };
    component.operation = mappedOperation;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_goto_kripton_tos"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith(url);
  });

  it('should stop spinner when confirmOperation throws error', async () => {
    fiatRampsServiceSpy.confirmOperation.and.returnValue(throwError('Error'));
    const formData = new FormData();
    formData.append('file', photo.dataUrl);
    component.operation = mappedOperation;
    component.voucherUploadedOnKripton = false;
    component.voucher = photo;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_upload_photo"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.uploadingVoucher).toBeFalse();
  });

  it('should call trackEvent on trackService when ux_buy_kripton_attach Button clicked', () => {
    component.operation = mappedOperation;
    component.voucherUploadedOnKripton = false;
    component.voucher = undefined;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_buy_kripton_attach');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should open modal when exit_operation Button clicked', () => {
    component.ionViewWillEnter();
    component.voucher = photo;
    
    const el = trackClickDirectiveHelper.getByElementByName('ion-button','exit_operation');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show ion footer when send a voucher to krypton', async() => {
    const formData = new FormData();
    formData.append('file', photo.dataUrl);
    component.operation = mappedOperation;
    component.voucherUploadedOnKripton = false;
    component.voucher = photo;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_upload_photo"]')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    const footerEl = fixture.debugElement.query(By.css('ion-footer[class="dp__footer"]'))    
    expect(footerEl).toBeFalsy()    
  });
});
