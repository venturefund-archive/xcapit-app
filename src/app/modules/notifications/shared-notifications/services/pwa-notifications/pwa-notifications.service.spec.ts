import { TestBed } from '@angular/core/testing';
import { FirebaseService } from 'src/app/shared/services/firebase/firebase.service';

import { PwaNotificationsService } from './pwa-notifications.service';

describe('PwaNotificationsService', () => {
  let service: PwaNotificationsService;
  let firebaseSpy: any;
  beforeEach(() => {
    firebaseSpy = jasmine.createSpyObj('FirebaseService', ['init']);
    firebaseSpy.init.and.returnValue({
      messaging: () => ({
        usePublicVapidKey: () => null,
        getToken: () => 'token',
      }),
    });
    firebaseSpy.messaging = jasmine.createSpyObj('FirebaseNameSpace.messaging', ['isSupported']);
    firebaseSpy.messaging.isSupported.and.returnValue(true);
    TestBed.configureTestingModule({ providers: [{ provide: FirebaseService, useValue: firebaseSpy }] });
  });

  beforeEach(() => {
    service = TestBed.inject(PwaNotificationsService);
    service.importedFirebase = firebaseSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be set messaging & initializaApp called when init is called', () => {
    service.init();
    expect(firebaseSpy.init).toHaveBeenCalledTimes(1);
    expect(service.messaging).toBeTruthy();
  });
});
