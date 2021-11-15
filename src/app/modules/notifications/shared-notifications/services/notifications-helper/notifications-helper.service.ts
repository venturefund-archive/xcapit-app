import { Injectable } from '@angular/core';
import { NotificationsStorageService } from '../notifications-storage/notifications-storage.service';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

export const FIREBASE_OBJ_KEY = 'firebase-messaging-msg-data';

@Injectable({
  providedIn: 'root',
})
export class NotificationsHelperService {
  constructor(
    private notificationsStorage: NotificationsStorageService,
    private toast: ToastService,
    private navController: NavController,
    private translate: TranslateService
  ) {}

  handleNewNotification(notification: any) {
    if (this.isPWANotification(notification)) {
      this.notificationsStorage.save(notification.data);
      this.showToast();
    } else if (this.isCapacitorNotification(notification)) {
      this.notificationsStorage.save(notification);
      this.showToast();
    }
  }

  isPWANotification(notification: any): boolean {
    return notification && notification.data && notification.data[FIREBASE_OBJ_KEY];
  }

  isCapacitorNotification(notification: any): boolean {
    return notification && notification.body && notification.data && notification.id && notification.title;
  }

  showToast() {
    this.toast.showToast({
      position: 'top',
      message: this.translate.instant('notifications.notifications_helper.message'),
      buttons: [
        { icon: 'close', side: 'start' },
        {
          text: this.translate.instant('notifications.notifications_helper.view_button'),
          side: 'end',
        },
      ],
    });
  }
}
