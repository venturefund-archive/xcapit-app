import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { OperationsNewPage } from './operations-new.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';

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

const formData = {
  valid: {
    data: {
      pais: 'Argentina',
      type: 'cash-in',
      par: 'ARSUSDT',
      currency_in: 'ARS',
      currency_out: 'USDT',
      amount_in: '145',
      amount_out: '1',
      wallet: '0x0000000000000000000dead',
      price_in: '145',
      price_out: '1',
    },
    valid: true,
  },
};

const userNew = {
  id: false,
};

describe('RampsMenuPage', () => {
  let component: OperationsNewPage;
  let fixture: ComponentFixture<OperationsNewPage>;
  let storageOperationServiceSpy: any;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsNewPage>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', ['updateData']);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        getQuotations: of({}),
        getUserWallets: of({}),
        checkUser: of({}),
        createUser: of({}),
      });

      TestBed.configureTestingModule({
        declarations: [OperationsNewPage, TrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          RouterTestingModule.withRoutes([
            { path: 'fiat-ramps/operations', component: DummyComponent },
            { path: 'fiat-ramps/confirm-page', component: DummyComponent },
          ]),
          HttpClientTestingModule,
          IonicModule,
          TranslateModule.forRoot(),
          ReactiveFormsModule,
        ],
        providers: [
          TrackClickDirective,
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: StorageOperationService, useValue: storageOperationServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsNewPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    storageOperationServiceSpy = TestBed.inject(StorageOperationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateData on handleSubmit and valid form', () => {
    fixture.detectChanges();
    storageOperationServiceSpy.updateData.and.returnValue({});
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    component.setOperationStorage();
    expect(storageOperationServiceSpy.updateData).toHaveBeenCalledTimes(1);
  });

  it('should call checkUser on handleSubmit and valid form', () => {
    fixture.detectChanges();
    fiatRampsServiceSpy.checkUser.and.returnValue(of(userNew));
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    component.checkUser();
    expect(fiatRampsServiceSpy.checkUser).toHaveBeenCalledTimes(1);
  });

  it('should call createUser on handleSubmit and valid form', () => {
    fixture.detectChanges();
    fiatRampsServiceSpy.checkUser.and.returnValue(of(userNew));
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    component.checkUser();
    expect(fiatRampsServiceSpy.createUser).toHaveBeenCalledTimes(1);
  });

  it('should redirect to user information form when status is USER_INFORMATION', () => {
    const url = component.getUrlByStatus('USER_INFORMATION');
    expect(url).toEqual(['fiat-ramps/user-information']);
  });

  it('should redirect to user bank information form when status is USER_BANK', () => {
    const url = component.getUrlByStatus('USER_BANK');
    expect(url).toEqual(['fiat-ramps/user-bank']);
  });

  it('should redirect to user images upload form when status is USER_IMAGES', () => {
    const url = component.getUrlByStatus('USER_IMAGES');
    expect(url).toEqual(['fiat-ramps/user-images']);
  });

  it('should redirect to new order confirm when status is COMPLETE', () => {
    const url = component.getUrlByStatus('COMPLETE');
    expect(url).toEqual(['fiat-ramps/confirm-page']);
  });

  it('should call getQuotations on click and valid form', () => {
    fixture.detectChanges();
    fiatRampsServiceSpy.getQuotations.and.returnValue(of({ data: [] }));
    component.getQuotations();
    expect(fiatRampsServiceSpy.getQuotations).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
