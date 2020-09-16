import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';
import { TranslateModule } from '@ngx-translate/core';

describe('LoadingService', () => {
  let service: LoadingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
