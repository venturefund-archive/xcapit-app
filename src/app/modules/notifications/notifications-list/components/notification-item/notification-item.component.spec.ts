import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationItemComponent } from './notification-item.component';
import { NotificationPipe } from '../../../shared-notifications/pipes/notification/notification.pipe';
import * as moment from 'moment';

const capacitorNotificationMock = {
  id: '1',
  body: 'capacitor notification...',
  data: {},
  title: 'capacitor title',
  internalDate: new Date(),
};

describe('NotificationItemComponent', () => {
  let component: NotificationItemComponent;
  let fixture: ComponentFixture<NotificationItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NotificationItemComponent, NotificationPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationItemComponent);
    component = fixture.componentInstance;
    component.notification = capacitorNotificationMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format the date on seconds when the interval between notification creation and now are seconds', () => {
    component.notification.created = moment(new Date()).subtract(20, 'seconds').toDate();
    component.ngOnInit();
    expect(component.createdTime).toContain('s');
  });

  it('should format the date on minutes when the interval between notification creation and now are minutes', async () => {
    component.notification.created = moment(new Date()).subtract(20, 'minutes').toDate();
    component.ngOnInit();
    expect(component.createdTime).toContain('m');
  });

  it('should format the date on hours when the interval between notification creation and now are hours', () => {
    component.notification.created = moment(new Date()).subtract(2, 'hours').toDate();
    component.ngOnInit();
    expect(component.createdTime).toContain('h');
  });
  it('should format the date on days when the interval between notification creation and now are days', () => {
    component.notification.created = moment(new Date()).subtract(2, 'days').toDate();
    component.ngOnInit();
    expect(component.createdTime).toContain('d');
  });
});
