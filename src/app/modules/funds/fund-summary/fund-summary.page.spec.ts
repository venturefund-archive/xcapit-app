import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSummaryPage } from './fund-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { CurrencyPercentagePipe } from '../shared-funds/pipes/currency-percentage/currency-percentage.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

const fundStatusMockData = {
  fund: {
    estado: 'active'
  },
  status: {}
};

describe('FundSummaryPage', () => {
  let component: FundSummaryPage;
  let fixture: ComponentFixture<FundSummaryPage>;
  let apiFundServiceMock: any;
  let subscriptionsServiceSpy: any;
  let logsServiceMock: any;
  beforeEach(async(() => {
    logsServiceMock = {
      log: () => of({})
    };
    apiFundServiceMock = {
      getStatus: () => of(fundStatusMockData),
      pauseFundRuns: () => of(null),
      resumeFundRuns: () => of(null),
      finalizeFundRuns: () => of(null),
      getFundRuns: () => of(null),
      changeFundCA: () => of(null)
    };
    subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', [
      'shareSubscriptionLink'
    ]);
    TestBed.configureTestingModule({
      declarations: [FundSummaryPage, CurrencyPercentagePipe],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule
      ],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
        { provide: ApiFundsService, useValue: apiFundServiceMock },
        { provide: SubscriptionsService, useValue: subscriptionsServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundServiceMock = TestBed.get(ApiFundsService);
    subscriptionsServiceSpy = TestBed.get(SubscriptionsService);
    logsServiceMock = TestBed.get(LogsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFundName on ionViewWillEnter', () => {
    const getFundStatusSpy = spyOn(component, 'getFundStatus');
    getFundStatusSpy.and.returnValue(of({}));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(getFundStatusSpy).toHaveBeenCalledTimes(1);
  });

  it('should call shareSubscriptionLink when getSubscriptionLink is callled', () => {
    component.shareFund();
    expect(subscriptionsServiceSpy.shareSubscriptionLink).toHaveBeenCalledTimes(
      1
    );
  });

  it('should call pauseFundRuns once on pauseFund button click', () => {
    const pauseFundRunsSpy = spyOn(apiFundServiceMock, 'pauseFundRuns');
    pauseFundRunsSpy.and.returnValue(of(null));
    component.pauseFundRuns();
    expect(pauseFundRunsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call resumeFundRuns once on resumeFund button click', () => {
    const resumeFundRunsSpy = spyOn(apiFundServiceMock, 'resumeFundRuns');
    resumeFundRunsSpy.and.returnValue(of(null));
    component.resumeFundRuns();
    expect(resumeFundRunsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call finalizeFundRuns once on finalizeFund button click', () => {
    const finalizeFundRunsSpy = spyOn(apiFundServiceMock, 'finalizeFundRuns');
    finalizeFundRunsSpy.and.returnValue(of(null));
    component.finalizeFundRuns();
    expect(finalizeFundRunsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call changeFundCA once on form is valid button click', () => {
    const changeFundCASpy = spyOn(apiFundServiceMock, 'changeFundCA');
    changeFundCASpy.and.returnValue(of(null));
    component.form.patchValue({ ca: 'BTC' });
    component.changeFundCA();
    expect(changeFundCASpy).toHaveBeenCalledTimes(1);
  });

  it('shouldnt call changeFundCA when form is invalid and button click', () => {
    const changeFundCASpy = spyOn(apiFundServiceMock, 'changeFundCA');
    changeFundCASpy.and.returnValue(of(null));
    component.changeFundCA();
    expect(changeFundCASpy).toHaveBeenCalledTimes(0);
  });

  it('should call getStatus once on ionViewWillEnter', () => {
    const getStatusSpy = spyOn(apiFundServiceMock, 'getStatus');
    getStatusSpy.and.returnValue(of(fundStatusMockData));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(getStatusSpy).toHaveBeenCalledTimes(1);
  });

  it('should match valid status', () => {
    component.fundStatus = { fund: { estado: 'toBTC-NF' } };
    fixture.detectChanges();
    component.isInCAStatus();
    expect(component.inCAStatus).toBeTruthy();
  });

  it('shouldnt match invalid status', () => {
    component.fundStatus = { fund: { estado: 'active' } };
    fixture.detectChanges();
    component.isInCAStatus();
    expect(component.inCAStatus).toBeFalsy();
  });

  it('should call log on ionViewDidEnter', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on getFundStatus', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.getFundStatus();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on changeFundCA', () => {
    const spyGetFund = spyOn(component, 'getFundStatus');
    spyGetFund.and.returnValue({});
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.form.patchValue({ ca: 'BTC' });
    component.changeFundCA();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on pauseFundRuns', () => {
    const spyGetFund = spyOn(component, 'getFundStatus');
    spyGetFund.and.returnValue({});
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.pauseFundRuns();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on resumeFundRuns', () => {
    const spyGetFund = spyOn(component, 'getFundStatus');
    spyGetFund.and.returnValue({});
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.resumeFundRuns();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on finalizeFundRuns', () => {
    const spyGetFund = spyOn(component, 'getFundStatus');
    spyGetFund.and.returnValue({});
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.finalizeFundRuns();
    expect(spy).toHaveBeenCalledTimes(1);
  });

});
