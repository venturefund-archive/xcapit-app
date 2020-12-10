import { TestBed } from '@angular/core/testing';
import { ApiWebflowService } from './api-webflow.service';
import { HttpClient } from '@angular/common/http';

describe('ApiWebflowService', () => {
  let HttpServiceSpy: any;
  let apiCommissionsService: ApiWebflowService;

  beforeEach(() => {
    HttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      http: { get: () => null }
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: HttpServiceSpy }
      ]
    });
    HttpServiceSpy = TestBed.inject(HttpClient);
    apiCommissionsService = TestBed.inject(ApiWebflowService);
  });

  it('should be created', () => {
    expect(apiCommissionsService).toBeTruthy();
  });
});
