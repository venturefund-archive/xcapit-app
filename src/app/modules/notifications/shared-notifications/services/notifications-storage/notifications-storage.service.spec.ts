import { TestBed } from '@angular/core/testing';

import { NotificationsStorageService } from './notifications-storage.service';
import { Storage } from '@ionic/storage';

const notificationsMock1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
const notificationsMock2 = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('NotificationsStorageService', () => {
  let service: NotificationsStorageService;
  let storageSpy: any;
  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['set', 'get']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Storage, useValue: storageSpy }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NotificationsStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be returned a notification', () => {
    service.notificationsArray = notificationsMock1;
    expect(service.get(1)).toBeTruthy();
  });

  it('should be returned a null notification if index is invalid', () => {
    service.notificationsArray = notificationsMock1;
    expect(service.get(15)).toBeFalsy();
  });

  it('should be removed a notification', () => {
    service.notificationsArray = notificationsMock2;
    service.remove(3);
    expect(service.get(3)).toBeFalsy();
  });

  it('should be saved a notification', () => {
    service.notificationsArray = notificationsMock2;
    service.save({});
    expect(service.get(4)).toBeTruthy();
  });
});
