import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribePage } from './subscribe.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiSubscriptionsService } from '../shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '../../../shared/services/toast/toast.service';

describe('SubscribePage', () => {
  let component: SubscribePage;
  let fixture: ComponentFixture<SubscribePage>;
  let apiSubscriptionsServiceSpy: any;
  let toastServiceSpy: any;

  beforeEach(async(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'showToast'
    ]);
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
        }, {
          provide: ToastService,
          useValue: toastServiceSpy
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
