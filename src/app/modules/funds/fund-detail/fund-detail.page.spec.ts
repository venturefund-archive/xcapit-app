import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundDetailPage } from './fund-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
const testMetrics = {
  fund: {
    fundName: 'Test',
    currency: 'BTC'
  },
  balance: {}
};

describe('FundDetailPage', () => {
  let component: FundDetailPage;
  let fixture: ComponentFixture<FundDetailPage>;
  let apiFundsMock: any;
  let apiFunds: any;
  beforeEach(async(() => {
    apiFundsMock = {
      getMetrics: () => of(testMetrics),
      getBalance: () => of({}),
      getFundRuns: () => of({})
    };
    TestBed.configureTestingModule({
      declarations: [FundDetailPage],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ApiFundsService, useValue: apiFundsMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(FundDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFunds = TestBed.get(ApiFundsService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProfitGraphCardInfo on ionViewWillEnter', () => {
    const spy = spyOn(component, 'getProfitGraphCardInfo');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getBalance on ionViewWillEnter', () => {
    const spy = spyOn(apiFunds, 'getBalance');
    spy.and.returnValue(of({}));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getFundRuns on ionViewWillEnter', () => {
    const spy = spyOn(apiFunds, 'getFundRuns');
    spy.and.returnValue(of({}));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
