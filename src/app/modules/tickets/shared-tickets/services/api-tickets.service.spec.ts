import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { ApiTicketsService } from './api-tickets.service';

describe('ApiTicketsService', () => {
  let service: ApiTicketsService;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;
  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', { post: of({}) });
    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: CustomHttpService, useValue: customHttpServiceSpy }],
    });
    service = TestBed.inject(ApiTicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be call post on http when createTicket', () => {
    service.createTicket('').subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
