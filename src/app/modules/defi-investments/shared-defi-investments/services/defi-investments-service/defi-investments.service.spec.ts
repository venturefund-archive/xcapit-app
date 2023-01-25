import { TestBed } from '@angular/core/testing';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { DefiInvestmentsService } from './defi-investments.service';

describe('DefiInvestmentsService', () => {
  let defiInvesmentService: DefiInvestmentsService;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CustomHttpService, useValue: customHttpServiceSpy }],
    });
    defiInvesmentService = TestBed.inject(DefiInvestmentsService);
  });

  it('should Be created', () => {
    expect(defiInvesmentService).toBeTruthy();
  });
});
