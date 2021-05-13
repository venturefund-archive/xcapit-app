import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { OperationsPagePage } from './operations-page.page';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PROVIDERS } from '../shared-ramps/constants/providers';

const operations = [
  {
    operation_id: 1,
    operation_type: 'cash-in',
    status: 'pending_by_validate',
    currency_in: 'ARS',
    amount_in: 550.0,
    currency_out: 'USDT',
    amount_out: 155.99,
    created_at: '2021-03-31T01:09:16.719Z',
    provider: '1',
  },
  {
    operation_id: 34,
    operation_type: 'cash-in',
    status: 'request',
    currency_in: 'ARS',
    amount_in: 550.0,
    currency_out: 'ETH',
    amount_out: 155.99,
    created_at: '2021-03-09T14:51:47.719Z',
    provider: '1',
  },
  {
    operation_id: 4,
    operation_type: 'cash-in',
    status: 'SUCCESSFULL',
    currency_in: 'ARS',
    amount_in: 550.0,
    currency_out: 'BTC',
    amount_out: 155.99,
    created_at: '2021-04-09T01:15:49.719Z',
    provider: '2',
  },
  {
    operation_id: 713,
    operation_type: 'cash-out',
    status: 'received',
    currency_in: 'USDT',
    amount_in: 155.99,
    currency_out: 'ARS',
    amount_out: 550.0,
    created_at: '2021-04-20T01:24:28.719Z',
    provider: '1',
  },
  {
    operation_id: 23,
    operation_type: 'cash-out',
    status: 'wait',
    currency_in: 'ETH',
    amount_in: 155.99,
    currency_out: 'ARS',
    amount_out: 550.0,
    created_at: '2021-04-08T04:07:19.719Z',
    provider: '1',
  },
  {
    operation_id: 65,
    operation_type: 'cash-out',
    status: 'EXPIRED',
    currency_in: 'BTC',
    amount_in: 125.3,
    currency_out: 'ARS',
    amount_out: 1550.0,
    created_at: '2021-03-20T17:53:18.719Z',
    provider: '2',
  },
  {
    operation_id: 3,
    operation_type: 'cash-in',
    status: 'CANCELED',
    currency_in: 'ARS',
    amount_in: 550.0,
    currency_out: 'BTC',
    amount_out: 155.99,
    created_at: '2021-03-03T17:46:13.719Z',
    provider: '2',
  },
  {
    operation_id: 3,
    operation_type: 'cash-in',
    status: 'SUCCESSFULL',
    currency_in: 'ARS',
    amount_in: 500.0,
    currency_out: 'BTC',
    amount_out: 15.99,
    created_at: '2021-03-03T17:59:13.719Z',
    provider: '2',
  },
  {
    operation_id: 2,
    operation_type: 'cash-in',
    status: 'complete',
    currency_in: 'ARS',
    amount_in: 150.0,
    currency_out: 'USDT',
    amount_out: 155.99,
    created_at: '2021-02-13T14:46:24.719Z',
    provider: '1',
  },
  {
    operation_id: 678,
    operation_type: 'cash-in',
    status: 'cancel',
    currency_in: 'ARS',
    amount_in: 500.0,
    currency_out: 'USDT',
    amount_out: 155.99,
    created_at: '2021-02-27T10:02:49.719Z',
    provider: '1',
  },
];

fdescribe('OperationsPagePage', () => {
  let component: OperationsPagePage;
  let fixture: ComponentFixture<OperationsPagePage>;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        getUserOperations: of([]),
      });

      TestBed.configureTestingModule({
        declarations: [OperationsPagePage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          RouterTestingModule.withRoutes([
            { path: 'fiat-ramps/operations-detail', component: DummyComponent },
            { path: 'tabs/funds', component: DummyComponent },
            { path: 'fiat-ramps/new-operation', component: DummyComponent },
          ]),
          HttpClientTestingModule,
          IonicModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(OperationsPagePage);
      component = fixture.componentInstance;
      component.operationsList = [];
      fixture.detectChanges();
    })
  );

  beforeEach(() => {});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserOperations on ionViewWillEnter', async () => {
    fiatRampsServiceSpy.getUserOperations.and.returnValue(of([]));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(1);
    });
  });

  it('should sort operations by date on getOperationsList', async () => {
    const spy = spyOn(Array.prototype, 'sort');
    fiatRampsServiceSpy.getUserOperations.and.returnValue(of([operations[0]]));
    component.getOperationsList();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  [
    {
      provider: PROVIDERS[0],
      testOperation: operations[0],
    },
    {
      provider: PROVIDERS[1],
      testOperation: operations[2],
    },
  ].forEach((p) => {
    describe(`when provider is ${p.provider.name}`, () => {
      it(`should change operation.provider on getOperationsList`, async () => {
        fiatRampsServiceSpy.getUserOperations.and.returnValue(of([p.testOperation]));
        component.getOperationsList();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.operationsList[0].provider).toEqual(p.provider);
        });
      });
      // it(`should redirect to ${p.route}`, () => {
      //   const operation = { id: 1, provider: { alias: p.provider } };
      //   component.viewOperationDetail(operation);
      //   expect(navControllerSpy.navigateForward).toHaveBeenCalledWith([p.route, operation.id]);
      // });
    });
  });
});
