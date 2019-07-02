import { TestBed } from '@angular/core/testing';

import { ApiSubscriptionsService } from './api-subscriptions.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

describe('ApiSubscriptionsService', () => {
  let customHttpServiceSpy: any;
  let apiSubscriptionsService: ApiSubscriptionsService;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', ['get']);
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy }
      ]
    });
    apiSubscriptionsService = TestBed.get(ApiSubscriptionsService)
  });

  it('should be created', () => {
    expect(apiSubscriptionsService).toBeTruthy();
  });
});
