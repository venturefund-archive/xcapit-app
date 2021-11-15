import { TestBed } from '@angular/core/testing';

import { NotificationsHelperService, FIREBASE_OBJ_KEY } from './notifications-helper.service';
import { NotificationsStorageService } from '../notifications-storage/notifications-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';

const pwaNotificationMock = { data: {} };
pwaNotificationMock.data[FIREBASE_OBJ_KEY] = {
  notification: {
    title: 'pwa title',
    body: 'pwa notification...',
  },
};
const capacitorNotificationMock = {
  id: '1',
  body: 'capacitor notification...',
  data: {},
  title: 'capacitor title',
};

describe('NotificationsHelperService', () => {
  let service: NotificationsHelperService;
  let notificationsStorageSpy: any;
  let navControllerSpy: any;
  let toastServiceSpy: any;

  beforeEach(() => {
    notificationsStorageSpy = jasmine.createSpyObj('NotificationsStorageService', ['save']);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      providers: [
        { provide: NotificationsStorageService, useValue: notificationsStorageSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NotificationsHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call save on notificationStorage when handleNotification is called with a valid pwa notification', () => {
    service.handleNewNotification(pwaNotificationMock);
    expect(notificationsStorageSpy.save).toHaveBeenCalledTimes(1);
  });

  it('should call save on notificationStorage when handleNotification is called with a valid capacitor notification', () => {
    service.handleNewNotification(capacitorNotificationMock);
    expect(notificationsStorageSpy.save).toHaveBeenCalledTimes(1);
  });

  it('should not call save on notificationStorage when handleNotification is called with a invalid notification', () => {
    service.handleNewNotification({});
    expect(notificationsStorageSpy.save).toHaveBeenCalledTimes(0);
  });

  it('should call showToast when handleNotification is called with a valid pwa notification', () => {
    const spy = spyOn(service, 'showToast');
    service.handleNewNotification(pwaNotificationMock);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call showToast when handleNotification is called with a valid capacitor notification', () => {
    const spy = spyOn(service, 'showToast');
    service.handleNewNotification(capacitorNotificationMock);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call showToast on toast when showToast is called', () => {
    service.showToast();
    expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
  });
});
