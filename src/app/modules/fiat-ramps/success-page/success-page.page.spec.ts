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
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';

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
  let storageOperationServiceMock: any;
  let storageOperationService: any;
  let navControllerSpy: any;
  let toastServiceSpy: any;
  let clipboardServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessPagePage>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      storageOperationServiceMock = {
        data: of(storageData.valid.data),
        valid: storageData.valid.valid,
        clear: () => of({}),
        getOperationId: () => of(operationId),
      };
      toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['write']);
      clipboardServiceSpy.write.and.returnValue(Promise.resolve());

      TestBed.configureTestingModule({
        declarations: [SuccessPagePage, TrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          RouterTestingModule.withRoutes([
            { path: 'operation-detail/provider/:provider_id/operation/:operation_id', component: DummyComponent },
          ]),
          HttpClientTestingModule,
          IonicModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          TrackClickDirective,
          { provide: StorageOperationService, useValue: storageOperationServiceMock },
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storageOperationService = TestBed.inject(StorageOperationService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when launchChat is called', () => {
    spyOn(window, 'open');
    component.launchChat();
    expect(window.open).toHaveBeenCalledTimes(1);
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
