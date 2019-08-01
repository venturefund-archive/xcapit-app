import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunSummaryPage } from './run-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPercentagePipe } from '../../funds/shared-funds/pipes/currency-percentage/currency-percentage.pipe';
import { ApiRunsService } from '../shared-runs/services/api-runs/api-runs.service';
import { of } from 'rxjs';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

describe('RunSummaryPage', () => {
  let component: RunSummaryPage;
  let fixture: ComponentFixture<RunSummaryPage>;
  let apiRunsServiceMock: any;
  let logsServiceMock: any;
  const fundStatusMockData = {
    fund: {
      estado: 'active'
    },
    status: {}
  };
  beforeEach(async(() => {
    apiRunsServiceMock = {
      getStatus: () => of(fundStatusMockData)
    };
    logsServiceMock = {
      log: () => of({})
    };
    TestBed.configureTestingModule({
      declarations: [RunSummaryPage, CurrencyPercentagePipe],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule
      ],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
        { provide: ApiRunsService, useValue: apiRunsServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiRunsServiceMock = TestBed.get(ApiRunsService);
    logsServiceMock = TestBed.get(LogsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getStatus once on ionViewWillEnter', () => {
    const getStatusSpy = spyOn(apiRunsServiceMock, 'getStatus');
    getStatusSpy.and.returnValue(of(fundStatusMockData));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(getStatusSpy).toHaveBeenCalledTimes(1);
  });

  it('should call log on ionViewDidEnter', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.ionViewDidEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on getRunStatus', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.getRunStatus();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
