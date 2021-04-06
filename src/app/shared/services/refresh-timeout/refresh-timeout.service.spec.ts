import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('RefreshTimeoutService', () => {
  let http: any;
  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['post']);
    http.post.and.returnValue(of({}));
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: http }]
    });
    service = TestBed.inject(RefreshTimeoutService);
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
