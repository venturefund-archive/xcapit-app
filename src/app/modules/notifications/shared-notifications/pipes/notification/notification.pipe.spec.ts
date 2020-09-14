import { NotificationPipe } from './notification.pipe';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FIREBASE_OBJ_KEY } from '../../services/notifications-helper/notifications-helper.service';

const pwaNotificationMock = {};
pwaNotificationMock[FIREBASE_OBJ_KEY] = {
  notification: {
    title: 'pwa title',
    body: 'pwa notification...'
  }
};
const capacitorNotificationMock = {
  id: '1',
  body: 'capacitor notification...',
  data: {},
  title: 'capacitor title'
};

describe('NotificationPipe', () => {
  const pipe = new NotificationPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Shallow pipe test', () => {
    @Component({
      template: `
        Title: {{ this.notification | notification: 'title' }} Body:
        {{ this.notification | notification: 'body' }}
      `
    })
    class TestComponent {
      notification: any;
    }

    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, NotificationPipe]
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    it('shoud return pwa notification data', () => {
      component.notification = pwaNotificationMock;
      fixture.detectChanges();
      expect(el.textContent).toContain('pwa notification');
    });

    it('shoud return capacitor notification data', () => {
      component.notification = capacitorNotificationMock;
      fixture.detectChanges();
      expect(el.textContent).toContain('capacitor notification');
    });

    it('shoud return empty data', () => {
      component.notification = {};
      fixture.detectChanges();
      expect(el.textContent).toEqual(' Title:  Body:  ');
    });
  });

  describe('Isolate pipe test', () => {
    it('shoud return pwa notification body', () => {
      expect(pipe.transform(pwaNotificationMock, 'body')).toContain(
        'pwa notification'
      );
    });

    it('shoud return capacitor notification body', () => {
      expect(pipe.transform(capacitorNotificationMock, 'body')).toContain(
        'capacitor notification'
      );
    });

    it('shoud return pwa notification title', () => {
      expect(pipe.transform(pwaNotificationMock, 'title')).toContain(
        'pwa title'
      );
    });

    it('shoud return capacitor notification title', () => {
      expect(pipe.transform(capacitorNotificationMock, 'title')).toContain(
        'capacitor title'
      );
    });
  });
});
