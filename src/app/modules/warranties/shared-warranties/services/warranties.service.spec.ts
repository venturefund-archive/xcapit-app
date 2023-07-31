import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { WarrantiesService } from './warranties.service';

describe('WarrantiesService', () => {
  let warrantiesService: WarrantiesService;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: CustomHttpService, useValue: customHttpServiceSpy }],
    });
    warrantiesService = TestBed.inject(WarrantiesService);
  });

  it('should be created', () => {
    expect(warrantiesService).toBeTruthy();
  });

  it('should call post on http when createWarranty', () => {
    warrantiesService.createWarranty({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when withdrawWarranty', () => {
    warrantiesService.withdrawWarranty({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when verifyWarranty', () => {
    warrantiesService.verifyWarranty({ wallet: '0xeeee', lender: 'aLenderName' }).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
