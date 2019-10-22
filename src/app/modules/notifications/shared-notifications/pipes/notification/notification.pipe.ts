import { Pipe, PipeTransform } from '@angular/core';
import { FIREBASE_OBJ_KEY } from '../../services/notifications-helper/notifications-helper.service';

@Pipe({
  name: 'notification'
})
export class NotificationPipe implements PipeTransform {
  private firebaseObjKey = FIREBASE_OBJ_KEY;
  private bodyKey = 'body';

  transform(value: any, ...args: any[]): any {
    return args[0] === this.bodyKey
      ? this.extractBody(value)
      : this.extractTitle(value);
  }

  extractTitle(notification: any): string {
    if (this.isPWANotification(notification)) {
      return notification[this.firebaseObjKey].notification.title;
    } else if (this.isCapacitorNotification(notification)) {
      return notification.title;
    }
  }

  extractBody(notification: any): string {
    if (this.isPWANotification(notification)) {
      return notification[this.firebaseObjKey].notification.body;
    } else if (this.isCapacitorNotification(notification)) {
      return notification.body;
    }
  }

  isPWANotification(notification: any): boolean {
    return notification && notification[this.firebaseObjKey];
  }

  isCapacitorNotification(notification: any): boolean {
    return (
      notification &&
      !notification[this.firebaseObjKey] &&
      notification.body &&
      notification.data &&
      notification.id &&
      notification.title
    );
  }
}
