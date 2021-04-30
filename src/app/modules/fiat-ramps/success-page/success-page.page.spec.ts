import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { SuccessPagePage } from './success-page.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

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

describe('SuccessPagePage', () => {
  let component: SuccessPagePage;
  let fixture: ComponentFixture<SuccessPagePage>;
  let storageOperationServiceMock: any;
  let storageOperationService: any;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      storageOperationServiceMock = {
        data: of(storageData.valid.data),
        valid: storageData.valid.valid,
        clear: () => of({}),
      };

      TestBed.configureTestingModule({
        declarations: [SuccessPagePage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],

        imports: [
          RouterTestingModule.withRoutes([{ path: 'fiat-ramps/operations', component: DummyComponent }]),
          HttpClientTestingModule,
          IonicModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: StorageOperationService, useValue: storageOperationServiceMock },
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when launchChat is called', () => {
    spyOn(window, 'open');
    component.launchChat();
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
