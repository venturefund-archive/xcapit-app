import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ReplaySubject } from 'rxjs';

export const notificationsStorageKey = 'notificationsStorage';
export const notificationStorageSize = 30;

@Injectable({
  providedIn: 'root'
})
export class NotificationsStorageService {
  notifications = new ReplaySubject<any[]>(1);
  notificationsArray: any[];

  constructor(private storage: Storage) {
    this.initStorage();
  }

  get(notificationId: number): any {
    const notifications = this.notificationsArray.filter(
      item => item.id === notificationId
    );
    return notifications.length ? notifications[0] : null;
  }

  async save(notification: any): Promise<void> {
    this.notificationsArray = [
      { ...notification, internalDate: new Date() },
      ...this.notificationsArray
    ].map((item, index) => {
      item.id = index + 1;
      return item;
    });
    this.checkStorageSize();
    this.saveNotifications();
    this.emitNotifications();
  }

  remove(id: number) {
    this.notificationsArray = this.notificationsArray.filter(
      item => item.id !== id
    );
    this.saveNotifications();
    this.emitNotifications();
  }

  private async initStorage() {
    this.notificationsArray =
      (await this.storage.get(notificationsStorageKey)) || [];
    this.emitNotifications();
  }

  private emitNotifications() {
    this.notifications.next(this.notificationsArray);
  }

  private saveNotifications() {
    this.storage.set(notificationsStorageKey, this.notificationsArray);
  }

  private checkStorageSize() {
    this.notificationsArray = this.notificationsArray.slice(
      0,
      notificationStorageSize
    );
  }
}
