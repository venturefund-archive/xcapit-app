import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { ConfirmPagePage } from './confirm-page.page';
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
      wallet: '0x000000000000000000000dead'
    },
    valid: true
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
      wallet: ''
    },
    valid: false
  }
};

describe('ConfirmPagePage', () => {
  let component: ConfirmPagePage;
  let fixture: ComponentFixture<ConfirmPagePage>;
  let storageOperationServiceMock: any;
  let storageOperationService: any;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ConfirmPagePage>;

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    storageOperationServiceMock = {
      data: of(storageData.valid.data),
      valid: storageData.valid.valid,
      clear: () => of({})
    }
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      createOperation: of({})
    });

    TestBed.configureTestingModule({
      declarations: [ ConfirmPagePage, TrackClickDirective ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'fiat-ramps/operations-new"', component: DummyComponent },
          { path: 'fiat-ramps/success-page', component: DummyComponent }
        ]),
        HttpClientTestingModule,
        IonicModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        TrackClickDirective,
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: StorageOperationService, useValue: storageOperationServiceMock },
        { provide: NavController, useValue: navControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storageOperationService = TestBed.inject(StorageOperationService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createOperation on click confirm button', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Next'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.createOperation).toHaveBeenCalledTimes(1);
  });
});
