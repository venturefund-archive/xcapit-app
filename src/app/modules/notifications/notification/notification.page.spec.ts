import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPage } from './notification.page';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationPipe } from '../shared-notifications/pipes/notification/notification.pipe';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { NotificationsStorageService } from '../shared-notifications/services/notifications-storage/notifications-storage.service';

describe('NotificationPage', () => {
  let component: NotificationPage;
  let fixture: ComponentFixture<NotificationPage>;
  let activatedRouteSpy: any;
  let notificationsStorageSpy: any;

  beforeEach(async(() => {
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        id: '1'
      })
    };
    notificationsStorageSpy = jasmine.createSpyObj(
      'NotificationsStorageService',
      ['get']
    );
    TestBed.configureTestingModule({
      declarations: [NotificationPage, NotificationPipe],
      imports: [TranslateModule.forRoot()],
      providers: [
        NotificationPage,
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: NotificationsStorageService, useValue: notificationsStorageSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
