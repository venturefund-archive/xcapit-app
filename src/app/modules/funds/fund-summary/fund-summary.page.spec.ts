import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSummaryPage } from './fund-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';


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

  beforeEach(async(() => {
    apiFundServiceMock = {
        getStatus: () => of(fundStatusMockData)
    };
    TestBed.configureTestingModule({
      declarations: [ FundSummaryPage ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ApiFundsService, useValue: apiFundServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundServiceMock = TestBed.get(ApiFundsService);
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
});
