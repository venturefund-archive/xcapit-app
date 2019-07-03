import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { FundSummaryPage } from './fund-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { routes } from '../funds-routing.module';
// import {Router} from '@angular/router';
// import { Location } from '@angular/common';

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
  // let router: Router;
  // let location: Location;

  beforeEach(async(() => {
    apiFundServiceMock = {
        getStatus: () => of(fundStatusMockData),
        pauseFundRuns: () => of(null),
        getFundRuns: () => of(null)
    };
    TestBed.configureTestingModule({
      declarations: [ FundSummaryPage ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes(routes)
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
    // router = TestBed.get(Router);
    // location = TestBed.get(Location);
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

  it('should call pauseFundRuns once on pauseFund button click', () => {
    const pauseFundRunsSpy = spyOn(apiFundServiceMock, 'pauseFundRuns');
    pauseFundRunsSpy.and.returnValue(of(null));
    component.pauseFundRuns();
    expect(pauseFundRunsSpy).toHaveBeenCalledTimes(1);
  });

  // it('should navigate to fund-runs on view runs', fakeAsync(() => {
  //   component.fundRuns('test');
  //   expect(location.path()).toBe('/fund-runs');
  // }));


});
