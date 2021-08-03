import { TestBed } from '@angular/core/testing';

import { ApiRunsService } from './api-runs.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';

describe('ApiRunsService', () => {
  let customHttpServiceSpy: any;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      http: { get: () => of({}) },
    });
    TestBed.configureTestingModule({
      providers: [{ provide: CustomHttpService, useValue: customHttpServiceSpy }],
      imports: [IonicModule],
    });
  });

  it('should be created', () => {
    const service: ApiRunsService = TestBed.inject(ApiRunsService);
    expect(service).toBeTruthy();
  });
});
