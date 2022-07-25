import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { FinancialEducationService } from './financial-education.service';

describe('FinancialEducationService', () => {
  let financialEducationService: FinancialEducationService;
  let customHttpServiceSpy: any;
  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      get: of({}),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: CustomHttpService, useValue: customHttpServiceSpy }],
    });
    financialEducationService = TestBed.inject(FinancialEducationService);
  });

  it('should be created', () => {
    expect(financialEducationService).toBeTruthy();
  });

  it('should call get on http when getEducationDataOf', () => {
    financialEducationService.getEducationDataOf('testAddress').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when getSubmoduleResultOf', () => {
    financialEducationService.getSubmoduleResultOf(1, 'testAddress').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });
});
