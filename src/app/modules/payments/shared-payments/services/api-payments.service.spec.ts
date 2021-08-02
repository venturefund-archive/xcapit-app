import { TestBed } from '@angular/core/testing';
import { ApiPaymentsService } from './api-payments.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

describe('ApiPaymentsService', () => {
  let apiPaymentservice: ApiPaymentsService;
  let customHttpServiceSpy: any;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
    });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: CustomHttpService, useValue: customHttpServiceSpy }],
    });
    apiPaymentservice = TestBed.inject(ApiPaymentsService);
  });

  it('should be created', () => {
    expect(apiPaymentservice).toBeTruthy();
  });

  it('it should call post on http when registerLicense', () => {
    apiPaymentservice.registerLicense().subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('it should call get on http when getPaymentMethods', () => {
    apiPaymentservice.getPaymentMethods().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('it should call get on http when getPaymentLink', () => {
    apiPaymentservice.getPaymentLink({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
