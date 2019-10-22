import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationItemComponent } from './notification-item.component';
import { NotificationPipe } from '../../../shared-notifications/pipes/notification/notification.pipe';

const capacitorNotificationMock = {
  id: '1',
  body: 'capacitor notification...',
  data: {},
  title: 'capacitor title',
  internalDate: new Date()
};

describe('NotificationItemComponent', () => {
  let component: NotificationItemComponent;
  let fixture: ComponentFixture<NotificationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationItemComponent, NotificationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationItemComponent);
    component = fixture.componentInstance;
    component.notification = capacitorNotificationMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call emit on clickRemove when remove is called', () => {
    const spy = spyOn(component.clickRemove, 'emit');
    component.remove();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call emit on clickNotification when notificationClicked is called', () => {
    const spy = spyOn(component.clickNotification, 'emit');
    component.notificationClicked();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
