import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';
import { Platform } from '@ionic/angular';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { PwaNotificationsService } from '../pwa-notifications/pwa-notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let platformSpy: any;
  let capacitorNotificationsServiceSpy: any;
  let pwaNotificationsServiceSpy: any;

  beforeEach(() => {
    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    capacitorNotificationsServiceSpy = jasmine.createSpyObj(
      'CapacitorNotificationsService',
      ['init']
    );
    pwaNotificationsServiceSpy = jasmine.createSpyObj(
      'PwaNotificationsService',
      ['init']
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: Platform, useValue: platformSpy },
        {
          provide: CapacitorNotificationsService,
          useValue: capacitorNotificationsServiceSpy
        },
        {
          provide: PwaNotificationsService,
          useValue: pwaNotificationsServiceSpy
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(NotificationsService);
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
});
