import { TestBed } from '@angular/core/testing';
import { ApiReferralsService } from './api-referrals.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ApiReferralsService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: []
    });
  });

  it('should be created', () => {
    const service: ApiReferralsService = TestBed.get(ApiReferralsService);
    expect(service).toBeTruthy();
  });
});
