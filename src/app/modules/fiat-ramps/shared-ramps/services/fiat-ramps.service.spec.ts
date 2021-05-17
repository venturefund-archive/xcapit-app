import { TestBed } from '@angular/core/testing';

import { FiatRampsService } from './fiat-ramps.service';
import { of } from 'rxjs';
import { CustomHttpService } from '../../../../shared/services/custom-http/custom-http.service';

describe('FiatRampsService', () => {
  let fiatRampsService: FiatRampsService;
  let customHttpServiceSpy: any;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
      put: of({}),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: CustomHttpService, useValue: customHttpServiceSpy }],
    });
    fiatRampsService = TestBed.inject(FiatRampsService);
    fiatRampsService.setProvider('1');
    customHttpServiceSpy = TestBed.inject(CustomHttpService);
  });

  it('should be created', () => {
    expect(fiatRampsService).toBeTruthy();
  });

  it('should call get on http when getQuotations', () => {
    fiatRampsService.getQuotations().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when getLink', () => {
    fiatRampsService.getLink(0).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when getUserOperations', () => {
    fiatRampsService.getUserOperations().subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when getUserSingleOperation', () => {
    fiatRampsService.getUserSingleOperation(0).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
