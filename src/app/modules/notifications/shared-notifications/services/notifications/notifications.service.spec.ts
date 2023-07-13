import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DefaultPlatformService } from '../../../../../shared/services/platform/default/default-platform.service';
import { NullNotificationsService } from '../null-notifications/null-notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let platformServiceSpy: jasmine.SpyObj<DefaultPlatformService>;
  let capacitorNotificationsServiceSpy: any;
  let nullNotificationsServiceSpy: any;

  beforeEach(() => {
    platformServiceSpy = jasmine.createSpyObj('PlatformService', { isNative: true });
    capacitorNotificationsServiceSpy = jasmine.createSpyObj('CapacitorNotificationsService', ['init']);
    nullNotificationsServiceSpy = jasmine.createSpyObj('NullNotificationsService', ['init']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        TranslateService,
        { provide: DefaultPlatformService, useValue: platformServiceSpy },
        {
          provide: CapacitorNotificationsService,
          useValue: capacitorNotificationsServiceSpy,
        },
        {
          provide: NullNotificationsService,
          useValue: nullNotificationsServiceSpy,
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
});
