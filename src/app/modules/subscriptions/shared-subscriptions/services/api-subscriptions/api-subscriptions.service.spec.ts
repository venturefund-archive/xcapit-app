import { TestBed } from '@angular/core/testing';

import { ApiSubscriptionsService } from './api-subscriptions.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

describe('ApiSubscriptionsService', () => {
  let customHttpServiceSpy: any;
  let apiSubscriptionsService: ApiSubscriptionsService;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy }
      ]
    });
    apiSubscriptionsService = TestBed.get(ApiSubscriptionsService);
  });

  it('should be created', () => {
    expect(apiSubscriptionsService).toBeTruthy();
  });

  it('should call get when getSubscriptionLink is called', () => {
    apiSubscriptionsService.getSubscriptionLink('test');
    expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should call get when subscribeToFund is called', () => {
    apiSubscriptionsService.subscribeToFund('', '');
    expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
  });
});
