import { TestBed } from '@angular/core/testing';
import { PublicLogsService } from './public-logs.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('PublicLogsService', () => {
  let http: any;
  let service: PublicLogsService;
  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['post']);
    http.post.and.returnValue(of({}));
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: http }]
    });
    service = TestBed.inject(PublicLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.post on trackView', () => {
    service.trackView({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('should call http.post on trackEvent', () => {
    service.trackEvent({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });
});
