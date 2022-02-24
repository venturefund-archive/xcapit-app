import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SuccessPagePage } from './success-page.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { BrowserService } from '../../../shared/services/browser/browser.service';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';

const storageData = {
  valid: {
    data: {
      pais: 'country',
      operacion: 'cash-in',
      par: 'one_pair',
      monto_entrada: '100',
      monto_salida: '100',
      moneda_entrada: 'ARS',
      moneda_salida: 'USDT',
      precio_entrada: '1',
      precio_salida: '100',
      wallet: '0x000000000000000000000dead',
    },
    valid: true,
  },
  invalid: {
    data: {
      pais: '',
      operacion: '',
      par: '',
      monto_entrada: '',
      monto_salida: '',
      moneda_entrada: '',
      moneda_salida: '',
      precio_entrada: '',
      precio_salida: '',
      wallet: '',
    },
    valid: false,
  },
};

const operationId = 6;

describe('SuccessPagePage', () => {
  let component: SuccessPagePage;
  let fixture: ComponentFixture<SuccessPagePage>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessPagePage>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      storageOperationServiceSpy = jasmine.createSpyObj(
        'StorageOperationService',
        {
          clear: of({}),
          getOperationId: of(operationId),
        },
        { data: of(storageData.valid.data), valid: storageData.valid.valid }
      );
      toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['write']);
      clipboardServiceSpy.write.and.returnValue(Promise.resolve());

      TestBed.configureTestingModule({
        declarations: [SuccessPagePage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [
          { provide: StorageOperationService, useValue: storageOperationServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when launchChat is called', () => {
    component.launchChat();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://t.me/kriptonmarket' });
  });

  it('should call write with cbu when copyToClipboard is called', async () => {
    component.cbu = 'test';
    const expectedArg = { url: 'test' };
    fixture.detectChanges();
    component.copyToClipboard();
    fixture.whenStable().then(() => {
      expect(clipboardServiceSpy.write).toHaveBeenCalledWith(expectedArg);
    });
  });

  it('should call showToast when copyToClipboard is called', async () => {
    component.cbu = '';
    fixture.detectChanges();
    component.copyToClipboard();
    fixture.whenStable().then(() => {
      expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
    });
  });

  it('should call instant when copyToClipboard is called', async () => {
    const spy = spyOn(TranslateService.prototype, 'instant');
    component.cbu = '';
    fixture.detectChanges();
    component.copyToClipboard();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call trackEvent on trackService when Copy CBU to Clipboard Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Copy CBU to Clipboard');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Add Voucher Button clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Add Voucher');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
