import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundBalancePage } from './fund-balance.page';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyEndBalancePipe } from './pipes/currency-end-balance/currency-end-balance.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { CurrencyTextPipe } from '../shared-funds/pipes/currency-text/currency-text.pipe';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

describe('FundBalancePage', () => {
  let component: FundBalancePage;
  let fixture: ComponentFixture<FundBalancePage>;
  let apiFundServiceSpy: any;
  let logsServiceMock: any;
  beforeEach(async(() => {
    apiFundServiceSpy = jasmine.createSpyObj('ApiFundsService', ['getBalance']);
    logsServiceMock = {
      log: () => of({})
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      declarations: [FundBalancePage, CurrencyEndBalancePipe, CurrencyTextPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
        { provide: ApiFundsService, useValue: apiFundServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundBalancePage);
    component = fixture.componentInstance;
    logsServiceMock = TestBed.get(LogsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFundBalance on ionViewWillEnter', () => {
    const getFundBalanceSpy = spyOn(component, 'getFundBalance');
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(getFundBalanceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getBalance on getFundBalance is callled', () => {
    apiFundServiceSpy.getBalance.and.returnValue(of({}));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(apiFundServiceSpy.getBalance).toHaveBeenCalledTimes(1);
  });

  it('should call log on ionViewDidEnter', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on getFundBalance', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    apiFundServiceSpy.getBalance.and.returnValue(of({}));
    component.getFundBalance();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
