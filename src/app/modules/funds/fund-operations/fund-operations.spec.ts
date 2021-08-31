import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FundOperationsPage } from './fund-operations.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { By } from '@angular/platform-browser';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { NavController } from '@ionic/angular';

describe('FundOperationsPage', () => {
  let component: FundOperationsPage;
  let fixture: ComponentFixture<FundOperationsPage>;
  let ionInfiniteScrollMock: any;
  let apiFundsServiceSpy: any;
  let storageSpy: any;
  let activatedRouteMock: any;
  let loadingServiceSpy: any;
  let navControllerSpy: any;

  const ordersTestData = {
    links: {
      next: null,
      previous: null,
    },
    cursors: {
      next: null,
      previous: null,
    },
    results: [
      {
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
      },
    ],
  };
  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);
    activatedRouteMock = { snapshot: { params: { fundName: 'testFundName' } } };
    ionInfiniteScrollMock = {
      complete: () => true,
      disabled: true,
    };
    apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', {
      getOperationsHistory: () => of(ordersTestData),
    });
    apiFundsServiceSpy.getOperationsHistory.and.returnValue(of(ordersTestData));
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'dismiss']);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      declarations: [FundOperationsPage],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        TranslateService,
        { provide: ApiFundsService, useValue: apiFundsServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(FundOperationsPage);
    component = fixture.componentInstance;
    component.infiniteScroll = ionInfiniteScrollMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set values on view will enter and no storage values', async () => {
    storageSpy.get.and.returnValues(Promise.resolve(''), Promise.resolve(''));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.storageSince).not.toBeUndefined();
    expect(component.storageUntil).not.toBeUndefined();
    expect(component.datepicker.cancelText).toBe('funds.fund_operations.cancel_datepicker_text');
    expect(component.datepicker.doneText).toBe('funds.fund_operations.done_datepicker_text');
    expect(storageSpy.get).toHaveBeenCalledTimes(2);
  });

  it('should set values on view will enter there are storage values', async () => {
    storageSpy.get.and.returnValues(Promise.resolve('2020-01-01T03:00:00Z'), Promise.resolve('2020-01-02T03:00:00Z'));
    expect(storageSpy.get).toHaveBeenCalledTimes(0);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(storageSpy.get).toHaveBeenCalledTimes(2);
    expect(component.storageSince).toBe('2020-01-01T03:00:00Z');
    expect(component.storageUntil).toBe('2020-01-02T03:00:00Z');
    expect(component.datepicker.cancelText).toBe('funds.fund_operations.cancel_datepicker_text');
    expect(component.datepicker.doneText).toBe('funds.fund_operations.done_datepicker_text');
  });

  it('should get operations history on did enter', async () => {
    storageSpy.get.and.returnValues(Promise.resolve('2020-01-01T03:00:00Z'), Promise.resolve('2020-01-02T03:00:00Z'));
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(apiFundsServiceSpy.getOperationsHistory).toHaveBeenCalledTimes(1);
  });

  it('should set values on storage when leave', async () => {
    storageSpy.set.and.returnValue(Promise.resolve());
    component.queryOptions = {
      ordering: '',
      since: 'testSince',
      until: 'testUntil',
    };
    await component.ionViewWillLeave();
    await fixture.whenStable();
    expect(storageSpy.set).toHaveBeenCalledWith('since', 'testSince');
    expect(storageSpy.set).toHaveBeenCalledWith('until', 'testUntil');
  });

  it('should set since when date changes', async () => {
    const sinceEl = fixture.debugElement.query(By.css('#datetime-since'));
    sinceEl.triggerEventHandler('ionChange', { detail: { value: '2020-01-01T03:00:00Z' } });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.queryOptions.since).toBe('2020-01-01T03:00:00Z');
  });

  it('should set until when date changes', async () => {
    const sinceEl = fixture.debugElement.query(By.css('#datetime-until'));
    sinceEl.triggerEventHandler('ionChange', { detail: { value: '2020-01-01T03:00:00Z' } });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.queryOptions.until).toBe('2020-01-01T03:00:00Z');
  });

  it('should not load more on infinite scroll is called and no cursor set', () => {
    component.paginationOptions.cursor = null;
    fixture.detectChanges();
    const infiniteScrollEl = fixture.debugElement.query(By.css('ion-infinite-scroll'));
    infiniteScrollEl.triggerEventHandler('ionInfinite', {});
    expect(apiFundsServiceSpy.getOperationsHistory).not.toHaveBeenCalled();
  });

  it('should load more on infinite scroll is called and no cursor set', () => {
    component.orders = [];
    component.paginationOptions.cursor = 'testCursor';
    fixture.detectChanges();
    const infiniteScrollEl = fixture.debugElement.query(By.css('ion-infinite-scroll'));
    infiniteScrollEl.triggerEventHandler('ionInfinite', {});
    expect(apiFundsServiceSpy.getOperationsHistory).toHaveBeenCalled();
  });

  it('should navigate when viewOrderDetail is called', async () => {
    component.orders = ordersTestData.results;
    fixture.detectChanges();
    const orderDetailEl = fixture.debugElement.query(By.css('#view-order-detail'));
    orderDetailEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['funds/fund-operations-detail', 83919]);
  });
});
