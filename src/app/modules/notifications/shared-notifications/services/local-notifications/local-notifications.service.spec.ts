import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocalNotificationsService } from './local-notifications.service';

describe('LocalNotificationsService', () => {
  let http: any;
  let service: LocalNotificationsService;
  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['post']);
    http.post.and.returnValue(of({}));
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
