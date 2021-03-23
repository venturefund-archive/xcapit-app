import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsListPage } from './notifications-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsStorageService } from '../shared-notifications/services/notifications-storage/notifications-storage.service';
import { NotificationsService } from '../shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';
import { of, ReplaySubject } from 'rxjs';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificationsListPage', () => {
  let component: NotificationsListPage;
  let fixture: ComponentFixture<NotificationsListPage>;
  let notificationsStorageSpy: any;
  let notificationsService: NotificationsService;
  let notificationsServiceMock: any;
  let navControllerSpy: any;

  beforeEach(waitForAsync(() => {
    notificationsServiceMock = {
      getNotifications: () => of([]),
      markAsRead: () => of(null)
    };
    notificationsStorageSpy = jasmine.createSpyObj(
      'NotificationsStorageService',
      ['remove']
    );
    notificationsStorageSpy.notifications = new ReplaySubject<any[]>(1);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      declarations: [NotificationsListPage],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: NotificationsStorageService,
          useValue: notificationsStorageSpy
        },
        {
          provide: NavController,
          useValue: navControllerSpy
        },
        {
          provide: NotificationsService,
          useValue: notificationsServiceMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    notificationsService = TestBed.inject(NotificationsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set notifications$ on ngOnInit', () => {
    component.ngOnInit();
    expect(component.notifications$).toBeTruthy();
  });

  it('should call getNotifications on ngOnInit', () => {
    const spy = spyOn(notificationsService, 'getNotifications');
    spy.and.returnValue(of([]));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call remove on notificationsStorageService when removeNotification is called', () => {
    component.removeNotification(1);
    expect(notificationsStorageSpy.remove).toHaveBeenCalledTimes(1);
  });

  it('should call navigateForward on navController when showNotification is called', () => {
    component.showNotification(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
  });

  it('should call navigateForward with "/notifications/view/${id}" on navController when showNotification is called', () => {
    const notificationId = 5;
    component.showNotification(notificationId);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith([
      `/notifications/view/${notificationId}`
    ]);
  });

  it('should call markAsRead on ionViewWillLeave', () => {
    const spy = spyOn(notificationsService, 'markAsRead');
    spy.and.returnValue(of(null));
    component.ionViewWillLeave();
    expect(spy).toHaveBeenCalledTimes(1);
  })
});
