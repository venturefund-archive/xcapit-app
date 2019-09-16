import { TestBed } from '@angular/core/testing';
import { ApiCommissionsService } from './api-commission.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

describe('ApiCommissionService', () => {
  let customHttpServiceSpy: any;
  let apiCommissionsService: ApiCommissionsService;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      http: { get: () => null }
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy }
      ]
    });
    customHttpServiceSpy = TestBed.get(CustomHttpService);
    apiCommissionsService = TestBed.get(ApiCommissionsService);
  });

  it('should be created', () => {
    expect(apiCommissionsService).toBeTruthy();
  });
});
