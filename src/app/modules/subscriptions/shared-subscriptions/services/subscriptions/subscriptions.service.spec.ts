import { TestBed } from '@angular/core/testing';

import { SubscriptionsService } from './subscriptions.service';
import { of } from 'rxjs';
import { ApiSubscriptionsService } from '../api-subscriptions/api-subscriptions.service';
import { TranslateModule } from '@ngx-translate/core';

describe('SubscriptionsService', () => {
  let apiSubscriptionsSpy: any;
  let subscriptionsService: SubscriptionsService;
  beforeEach(() => {
    apiSubscriptionsSpy = jasmine.createSpyObj('ApiSubscriptionsService', ['getSubscriptionLink']);
    apiSubscriptionsSpy.getSubscriptionLink.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ApiSubscriptionsService, useValue: apiSubscriptionsSpy }
      ]
    });
    subscriptionsService = TestBed.get(SubscriptionsService);
  });

  it('should be created', () => {
    expect(subscriptionsService).toBeTruthy();
  });

  it('should call getSubscriptionLink when shareSubscriptionLink is callled', () => {
    subscriptionsService.shareSubscriptionLink('fundName');
    expect(apiSubscriptionsSpy.getSubscriptionLink).toHaveBeenCalledTimes(1);
  });
});
