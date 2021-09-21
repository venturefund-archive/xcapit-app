import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ScanQrPage } from './scan-qr.page';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../../shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { QrScannerStubComponent } from '../shared-apikeys/components/qr-scanner/qr-scanner-stub.component.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

const errorScannedApiKeys = {
  error: true,
  errorType: 'invalidQR',
};

const validScannedApiKeys = { scannedApikeys: {} };

describe('ScanQrPage', () => {
  let component: ScanQrPage;
  let fixture: ComponentFixture<ScanQrPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ScanQrPage>;
  let toastServiceMock: any;
  let toastService: ToastService;
  let storageApiKeysServiceMock: any;
  let storageApiKeysService: StorageApikeysService;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  let activatedRouteSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({}, {});
      navControllerSpy = fakeNavController.createSpy();
      toastServiceMock = {
        showToast: () => Promise.resolve(),
      };
      storageApiKeysServiceMock = {
        updateData: () => null,
      };

      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          isTutorialStep: 'false',
        }),
      };
      TestBed.configureTestingModule({
        declarations: [ScanQrPage, QrScannerStubComponent, TrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: ToastService, useValue: toastServiceMock },
          { provide: StorageApikeysService, useValue: storageApiKeysServiceMock },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ScanQrPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      toastService = TestBed.inject(ToastService);
      storageApiKeysService = TestBed.inject(StorageApikeysService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error toast when the keys scanned have errors', async () => {
    const spy = spyOn(toastService, 'showToast');
    spy.and.returnValue(Promise.resolve());
    fixture.debugElement
      .query(By.css('app-qr-scanner'))
      .triggerEventHandler('scannedApikeysEvent', errorScannedApiKeys);
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update storage and navigate back to apikeys (not tutorial) register when keys were scanned successfully', async () => {
    const spy = spyOn(storageApiKeysService, 'updateData');
    spy.and.returnValue();
    fixture.debugElement
      .query(By.css('app-qr-scanner'))
      .triggerEventHandler('scannedApikeysEvent', validScannedApiKeys);
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/apikeys/register']);
  });

  it('should update storage and navigate back to apikeys register (tutorial) when keys were scanned successfully', async () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        isTutorialStep: 'true',
      }),
    };
    const spy = spyOn(storageApiKeysService, 'updateData');
    spy.and.returnValue();
    component.ionViewWillEnter();
    fixture.debugElement
      .query(By.css('app-qr-scanner'))
      .triggerEventHandler('scannedApikeysEvent', validScannedApiKeys);
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/apikeys/tutorial/register']);
  });

  it('should start reading QR on IonViewWillEnter', () => {
    const spy = spyOn(component.qrScanner, 'readQRCode');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should stop reading QR on IonViewDidLeave', () => {
    const spy = spyOn(component.qrScanner, 'stopQRScan');
    component.ionViewDidLeave();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate back to apikeys register (tutorial) when the keys scanning is stopped', () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        isTutorialStep: 'true',
      }),
    };
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('app-qr-scanner')).triggerEventHandler('stoppedScan', null);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/apikeys/tutorial/register']);
  });

  it('should navigate back to apikeys register (not tutorial) when the keys scanning is stopped', () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('app-qr-scanner')).triggerEventHandler('stoppedScan', null);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/apikeys/register']);
  });
});
