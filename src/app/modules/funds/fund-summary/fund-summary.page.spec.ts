import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSummaryPage } from './fund-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';

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

  beforeEach(async(() => {
    apiFundServiceMock = {
      getStatus: () => of(fundStatusMockData)
    };
    subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', [
      'shareSubscriptionLink'
    ]);
    TestBed.configureTestingModule({
      declarations: [FundSummaryPage],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFundName on ionViewWillEnter', () => {
    const getFundNameSpy = spyOn(component, 'getFundName');
    getFundNameSpy.and.returnValue(of({}));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(getFundNameSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getStatus on getFundName is callled', () => {
    const getStatusSpy = spyOn(apiFundServiceMock, 'getStatus');
    getStatusSpy.and.returnValue(of(fundStatusMockData));
    component.getFundName().subscribe(() => {
      expect(getStatusSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call getStatus on getFundName is callled, return empty', () => {
    const getStatusSpy = spyOn(apiFundServiceMock, 'getStatus');
    getStatusSpy.and.returnValue(of(null));
    component.getFundName().subscribe(() => {
      expect(getStatusSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call getStatus on getFundName is callled, return with not status', () => {
    const getStatusSpy = spyOn(apiFundServiceMock, 'getStatus');
    getStatusSpy.and.returnValue(of({}));
    component.getFundName().subscribe(() => {
      expect(getStatusSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call shareSubscriptionLink when getSubscriptionLink is callled', () => {
    component.shareFund();
    expect(subscriptionsServiceSpy.shareSubscriptionLink).toHaveBeenCalledTimes(1);
  });
});
