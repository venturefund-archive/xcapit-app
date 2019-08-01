import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribePage } from './subscribe.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiSubscriptionsService } from '../shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

describe('SubscribePage', () => {
  let component: SubscribePage;
  let fixture: ComponentFixture<SubscribePage>;
  let apiSubscriptionsServiceSpy: any;
  let logsServiceMock: any;

  beforeEach(async(() => {
    apiSubscriptionsServiceSpy = jasmine.createSpyObj(
      'ApiSubscriptionsService',
      ['subscribeToFund']
    );
    logsServiceMock = {
      log: () => of({})
    };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      declarations: [SubscribePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
        {
          provide: ApiSubscriptionsService,
          useValue: apiSubscriptionsServiceSpy
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logsServiceMock = TestBed.get(LogsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call log on ngOnInit', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on handleSubscriptionResponse success', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.handleSubscriptionResponse({
      fundName: 'test',
      isSubscribe: true
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on handleSubscriptionResponse error', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.handleSubscriptionResponse({});
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
