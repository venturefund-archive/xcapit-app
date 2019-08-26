import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribePage } from './subscribe.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiSubscriptionsService } from '../shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { TranslateModule } from '@ngx-translate/core';

describe('SubscribePage', () => {
  let component: SubscribePage;
  let fixture: ComponentFixture<SubscribePage>;
  let apiSubscriptionsServiceSpy: any;

  beforeEach(async(() => {
    apiSubscriptionsServiceSpy = jasmine.createSpyObj(
      'ApiSubscriptionsService',
      ['subscribeToFund']
    );
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      declarations: [SubscribePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
