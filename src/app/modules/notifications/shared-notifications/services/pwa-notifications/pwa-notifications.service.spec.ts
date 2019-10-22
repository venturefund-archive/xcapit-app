import { TestBed } from '@angular/core/testing';

import { PwaNotificationsService } from './pwa-notifications.service';

describe('PwaNotificationsService', () => {
  let service: PwaNotificationsService;
  let firebaseSpy: any;
  beforeEach(() => {
    firebaseSpy = jasmine.createSpyObj('FirebaseNameSpace', ['initializeApp']);
    firebaseSpy.initializeApp.and.returnValue({
      messaging: () => ({
        usePublicVapidKey: () => null,
        getToken: () => 'token'
      })
    });
    firebaseSpy.messaging = jasmine.createSpyObj(
      'FirebaseNameSpace.messaging',
      ['isSupported']
    );
    firebaseSpy.messaging.isSupported.and.returnValue(true);
    TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    service = TestBed.get(PwaNotificationsService);
    service.importedFirebase = firebaseSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be set messaging & initializaApp called when init is called', () => {
    service.init();
    expect(service.importedFirebase.initializeApp).toHaveBeenCalledTimes(1);
    expect(service.messaging).toBeTruthy();
  });
});
