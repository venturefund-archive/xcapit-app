import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { PwaNotificationsService } from '../pwa-notifications/pwa-notifications.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PlatformService } from '../../../../../shared/services/platform/platform.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let capacitorNotificationsServiceSpy: any;
  let pwaNotificationsServiceSpy: any;
  let customHttpServiceSpy: any;

  beforeEach(() => {
    platformServiceSpy = jasmine.createSpyObj('PlatformService', { isNative: true });
    capacitorNotificationsServiceSpy = jasmine.createSpyObj('CapacitorNotificationsService', ['init']);
    pwaNotificationsServiceSpy = jasmine.createSpyObj('PwaNotificationsService', ['init']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      get: of({}),
      put: of({}),
      post: of({}),
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        TranslateService,
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        {
          provide: CapacitorNotificationsService,
          useValue: capacitorNotificationsServiceSpy,
        },
        {
          provide: PwaNotificationsService,
          useValue: pwaNotificationsServiceSpy,
        },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an object if not web platform', () => {
    platformServiceSpy.isNative.and.returnValue(false);
    expect(typeof service.getInstance()).toEqual('object');
  });

  it('should return an object if web platform', () => {
    expect(typeof service.getInstance()).toEqual('object');
  });

  it('should be call get on http when getNotifications', () => {
    service.getNotifications().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getCountNotifications', () => {
    service.getCountNotifications().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call put on http when markAsRead', () => {
    service.markAsRead().subscribe(() => {
      expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call post on http when toggle', () => {
    service.toggle(true).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
