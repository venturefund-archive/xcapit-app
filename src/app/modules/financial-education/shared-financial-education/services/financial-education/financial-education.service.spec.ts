import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { EnvService } from 'src/app/shared/services/env/env.service';

import { FinancialEducationService } from './financial-education.service';

describe('FinancialEducationService', () => {
  let financialEducationService: FinancialEducationService;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      get: of({}),
    });

    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: 'http://nonprod.url/v1/api',
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: EnvService, useValue: envServiceSpy },
      ],
    });
    financialEducationService = TestBed.inject(FinancialEducationService);
  });

  it('should be created', () => {
    expect(financialEducationService).toBeTruthy();
  });

  it('should call get on http when getEducationDataOf', () => {
    financialEducationService.getEducationDataOf('testAddress').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledOnceWith(
        'http://nonprod.url/v1/api/financial_education/education-data-of/testAddress',
        undefined,
        undefined,
        false
      );
    });
  });

  it('should call get on http when getSubmoduleResultOf', () => {
    financialEducationService.getSubmoduleResultOf(1, 'testAddress').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledOnceWith(
        'http://nonprod.url/v1/api/financial_education/submodule-data-of/1/testAddress',
        undefined,
        undefined,
        false
      );
    });
  });
});
