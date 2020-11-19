import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundOperationsDetailPage } from '../fund-operations-detail/fund-operations-detail.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalizedDatePipe } from 'src/app/shared/pipes/localized-date/localized-date.pipe';
import { DatePipe } from '@angular/common';

describe('FundOperationsDetailPage', () => {
  let component: FundOperationsDetailPage;
  let fixture: ComponentFixture<FundOperationsDetailPage>;
  let apiFundsServiceSpy: any;
  const orderTestData = {
    id: 83919,
    creation_datetime: '2020-11-12T00:00:12.492893Z',
    symbol: 'ETH/USDT',
    order_id: '2012577421',
    exchange_creation_time: '1605139212416',
    origQty: 0.11169,
    price: 463.19,
    status: 'closed',
    time_in_force: 'GTC',
    order_type: 'market',
    side: 'buy',
    fund_name: 'preprodProUSDT',
    client_order_id: 'x-XFJJNYUU',
    executedQty: 0.11169,
    cummulative_quote_qty: 51.7336911,
    stop_price: null,
    iceberg_qty: null,
    update_datetime: null,
    is_working: true,
    fee_cost: 0.00011169,
    fee_currency: 'ETH',
  };
  beforeEach(async(() => {
    apiFundsServiceSpy = {
      getOrderDetail: () => of(orderTestData),
    };
    TestBed.configureTestingModule({
      declarations: [FundOperationsDetailPage, LocalizedDatePipe],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        TranslateService,
        { provide: ApiFundsService, useValue: apiFundsServiceSpy },
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundOperationsDetailPage);
    component = fixture.componentInstance;
    apiFundsServiceSpy = TestBed.inject(ApiFundsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOrder on ionViewDidEnter', () => {
    const getOperationsHistorySpy = spyOn(component, 'getOrder');
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(getOperationsHistorySpy).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getOrderDetail on getOrder', () => {
    const spy = spyOn(apiFundsServiceSpy, 'getOrderDetail');
    spy.and.returnValue(of(orderTestData));
    component.getOrder();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
