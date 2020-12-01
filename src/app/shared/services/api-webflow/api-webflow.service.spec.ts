import { TestBed } from '@angular/core/testing';
import { ApiWebflowService } from './api-webflow.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

describe('ApiCommissionService', () => {
  let customHttpServiceSpy: any;
  let apiCommissionsService: ApiWebflowService;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      http: { get: () => null }
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy }
      ]
    });
    customHttpServiceSpy = TestBed.inject(CustomHttpService);
    apiCommissionsService = TestBed.inject(ApiWebflowService);
  });

  it('should be created', () => {
    expect(apiCommissionsService).toBeTruthy();
  });
});
