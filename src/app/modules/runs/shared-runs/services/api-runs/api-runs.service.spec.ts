import { TestBed } from '@angular/core/testing';

import { ApiRunsService } from './api-runs.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';

describe('ApiRunsService', () => {
  let customHttpServiceSpy: any;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      http: { get: () => of({}) }
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: ApiRunsService = TestBed.get(ApiRunsService);
    expect(service).toBeTruthy();
  });
});
