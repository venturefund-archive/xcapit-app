import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { Platform } from '@ionic/angular';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { PwaNotificationsService } from '../pwa-notifications/pwa-notifications.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let platformSpy: any;
  let capacitorNotificationsServiceSpy: any;
  let pwaNotificationsServiceSpy: any;
  let customHttpServiceSpy: any;

  beforeEach(() => {
    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    capacitorNotificationsServiceSpy = jasmine.createSpyObj('CapacitorNotificationsService', ['init']);
    pwaNotificationsServiceSpy = jasmine.createSpyObj('PwaNotificationsService', ['init']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      get: of({}),
      put: of({}),
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        TranslateService,
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: Platform, useValue: platformSpy },
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

  it('should return an object if platform.is return false', () => {
    platformSpy.is.and.returnValue(false);
    expect(typeof service.getInstance()).toEqual('object');
  });

  it('should return an object if platform.is return true', () => {
    platformSpy.is.and.returnValue(true);
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
});
