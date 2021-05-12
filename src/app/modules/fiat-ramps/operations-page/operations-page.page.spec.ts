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

const operations = [
  {
    id: 34,
    currency_in: 'ARS',
    currency_out: 'USDT',
    provider: '1',
    amount_in: 550.0,
    status: 'pending_by_validate',
    created_at: '05/04/20',
  },
  {
    id: 23,
    currency_in: 'ARS',
    currency_out: 'BTC',
    provider: 'paxful',
    amount_in: 1000.0,
    status: 'pending_by_validate',
    created_at: '04/05/20',
  },
  {
    id: 5,
    currency_in: 'ARS',
    currency_out: 'BTC',
    provider: '1',
    amount_in: 1000.0,
    status: 'pending_by_validate',
    created_at: '01/22/20',
  },
  {
    id: 55,
    currency_in: 'ARS',
    currency_out: 'BTC',
    provider: 'paxful',
    amount_in: 1000.0,
    status: 'pending_by_validate',
    created_at: '05/02/20',
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
        getUserOperations: of({}),
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserOperations on ionViewWillEnter', async (done) => {
    fiatRampsServiceSpy.getUserOperations.and.returnValue(of({}));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should sort operations by date on ionViewWillEnter', async (done) => {
    const expectedOrder = ['05/04/20', '05/02/20', '04/05/20', '01/22/20'];
    fiatRampsServiceSpy.getUserOperations.and.returnValue(of(operations));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const actualOrder = component.operationsList.map((operation) => operation.created_at);
      expect(actualOrder).toEqual(expectedOrder);
    });
    done();
  });

  it('should add alias, name and logoRoute to providers on ionViewWillEnter', async (done) => {
    const expectedProperties = ['alias', 'name', 'logoRoute'].sort();
    fiatRampsServiceSpy.getUserOperations.and.returnValue(of([operations[0]]));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const actualProperties = Object.keys(component.operationsList[0].provider).sort();
      expect(actualProperties).toEqual(expectedProperties);
    });
    done();
  });

  [
    {
      provider: '1',
      route: 'fiat-ramps/operations-detail',
    },
    {
      provider: 'paxful',
      route: 'fiat-ramps/operations-detail-paxful',
    },
  ].forEach((p) => {
    describe(`when provider is ${p.provider}`, () => {
      it(`should redirect to ${p.route}`, () => {
        const operation = { id: 1, provider: { alias: p.provider } };
        component.viewOperationDetail(operation);
        expect(navControllerSpy.navigateForward).toHaveBeenCalledWith([p.route, operation.id]);
      });
    });
  });
});
