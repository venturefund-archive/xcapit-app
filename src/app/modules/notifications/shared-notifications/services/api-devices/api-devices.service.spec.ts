import { TestBed } from '@angular/core/testing';
import { ApiDevicesService } from './api-devices.service';
import { CustomHttpService } from '../../../../../shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';

describe('ApiDevicesService', () => {
  let service: ApiDevicesService;
  let customHttpServiceSpy: any;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', { post: of({}) });
    TestBed.configureTestingModule({
      providers: [{ provide: CustomHttpService, useValue: customHttpServiceSpy }],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ApiDevicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be call post on http when registerDevice', () => {
    service.register('a_token').subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
