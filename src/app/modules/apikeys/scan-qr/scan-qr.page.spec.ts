import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ScanQrPage } from './scan-qr.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../testing/dummy.component.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../../shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';

describe('ScanQrPage', () => {
  let component: ScanQrPage;
  let fixture: ComponentFixture<ScanQrPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ScanQrPage>;
  let toastServiceMock: any;
  let toastService: ToastService;
  let storageApiKeysServiceMock: any;
  let storageApiKeysService: StorageApikeysService;

  beforeEach(waitForAsync(() => {
    toastServiceMock = {
      showToast: () => Promise.resolve()
    };
    storageApiKeysServiceMock = {
      updateData: () => null
    };
    TestBed.configureTestingModule({
      declarations: [ScanQrPage, DummyComponent, TrackClickDirective],
      imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule.withRoutes([
        { path: 'apikeys/register', component: DummyComponent }
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ToastService, useValue: toastServiceMock },
        { provide: StorageApikeysService, useValue: storageApiKeysServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    toastService = TestBed.inject(ToastService);
    storageApiKeysService = TestBed.inject(StorageApikeysService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showErrorToast when apiKeysScanned is called with error', () => {
    const spy = spyOn(toastService, 'showToast');
    spy.and.returnValue(Promise.resolve());
    component.apiKeysScanned({ error: true });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update storage when apiKeysScanned is called without error', () => {
    const spy = spyOn(storageApiKeysService, 'updateData');
    spy.and.returnValue();
    component.apiKeysScanned({ scannedApikeys: {} });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Register Key Manually Button clicked', () => {
    spyOn(component, 'stopQRScan');
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Register Key Manually'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
