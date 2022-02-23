import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { OperationsDetailPage } from './operations-detail.page';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const operation = {
  operation_id: 678,
  operation_type: 'cash-in',
  status: 'cancel',
  currency_in: 'ARS',
  amount_in: 500.0,
  currency_out: 'USDT',
  amount_out: 155.99,
  created_at: '2021-02-27T10:02:49.719Z',
  provider: '1',
  voucher: false,
};

const provider = PROVIDERS[1];

const photo = {
  dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD==',
  type: 'jpeg',
};

describe('OperationsDetailPage', () => {
  let component: OperationsDetailPage;
  let fixture: ComponentFixture<OperationsDetailPage>;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsDetailPage>;
  let activatedRouteSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        getUserSingleOperation: of([{}]),
        confirmOperation: of({}),
        setProvider: null,
      });

      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          operation_id: operation.operation_id.toString(),
          provider_id: operation.provider,
        }),
      };

      TestBed.configureTestingModule({
        declarations: [OperationsDetailPage, FakeTrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          RouterTestingModule.withRoutes([{ path: 'fiat-ramps/operations', component: DummyComponent }]),
          HttpClientTestingModule,
          IonicModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsDetailPage);
    component = fixture.componentInstance;
    component.operation = operation;
    component.provider = provider;
    component.hasVoucher = false;
    component.comprobante = photo;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserSingleOperation on ionViewWillEnter', async () => {
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([operation]));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(fiatRampsServiceSpy.getUserSingleOperation).toHaveBeenCalledTimes(1);
  });

  it('should call confirmOperation on sendPicture with and a voucher image', () => {
    fixture.detectChanges();
    component.comprobante = photo;
    component.sendPicture();
    expect(fiatRampsServiceSpy.confirmOperation).toHaveBeenCalledTimes(1);
  });

  it('should get provider_id from url', () => {
    const spy = spyOn(component, 'getProvider').and.returnValue(provider);
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should get operation_id from url', () => {
    const spy = spyOn(component, 'getUserOperation');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledWith('678');
  });

  PROVIDERS.forEach((p) => {
    describe(`when provider is ${p.name}`, () => {
      it(`should return ${p.name} on getProvider`, () => {
        const result = component.getProvider(p.id.toString());
        fixture.detectChanges();
        expect(result).toEqual(p);
      });

      it(`should set provider to ${p.name}`, () => {
        activatedRouteSpy.snapshot = {
          paramMap: convertToParamMap({
            operation_id: operation.operation_id.toString(),
            provider_id: p.id.toString(),
          }),
        };

        component.ionViewWillEnter();
        fixture.detectChanges();
        const result = component.provider;
        expect(result).toEqual(p);
      });
    });
  });

  it('should set operation to data', () => {
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([operation]));
    component.ionViewWillEnter();
    fixture.detectChanges();
    const result = component.operation;
    expect(result).toEqual(operation);
  });

  it('should calculate quotations from operation data for cash-in', () => {
    const cashIn = {
      operation_type: 'cash-in',
      amount_in: 550.0,
      amount_out: 100.0,
    };
    const expectedResult = 5.5;
    component.operation = cashIn;
    component.calculateQuotation();
    fixture.detectChanges();
    expect(component.cotizacion).toEqual(expectedResult);
  });

  it('should calculate quotations from operation data for cash-out', () => {
    const cashOut = {
      operation_type: 'cash-out',
      amount_in: 100.0,
      amount_out: 540.0,
    };
    const expectedResult = 5.4;
    component.operation = cashOut;
    component.calculateQuotation();
    fixture.detectChanges();
    expect(component.cotizacion).toEqual(expectedResult);
  });

  it('should call trackEvent on trackService when My Operations Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'My Operations');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Upload Voucher Button clicked', () => {
    spyOn(component, 'addPhoto');
    component.ionViewWillEnter();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Upload Voucher');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Submit Voucher Button clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Submit Voucher');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
