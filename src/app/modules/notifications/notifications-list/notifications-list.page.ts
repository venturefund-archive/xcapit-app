import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsStorageService } from '../shared-notifications/services/notifications-storage/notifications-storage.service';
import { NotificationsService } from '../shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notifications-list',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'notifications.notifications_list.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="">
      <ion-list *ngIf="this.notifications">
        <app-notification-item
          *ngFor="let notification of notifications"
          [notification]="notification"
          (clickRemove)="this.removeNotification($event)"
          (clickNotification)="this.showNotification($event)"
        ></app-notification-item>
        <div *ngIf="!notifications.length">
          <ion-text>{{ 'notifications.notifications_list.error_message' | translate }}</ion-text>
        </div>
      </ion-list>
      <ng-template #loading>
        <ion-list>
          <app-skeleton-notification-item
            *ngFor="let i of [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]"
          ></app-skeleton-notification-item>
        </ion-list>
      </ng-template>
    </ion-content>
  `,
  styleUrls: ['./notifications-list.page.scss'],
})
export class NotificationsListPage implements OnInit {
  notifications$: Observable<any>;
  notifications: any;

  constructor(
    private notificationsStorage: NotificationsStorageService,
    private navController: NavController,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.notifications$ = this.notificationsStorage.notifications;
    this.getNotifications();
  }

  ionViewWillLeave() {
    this.markAsRead();
  }

  removeNotification(notificationId: any) {
    this.notificationsStorage.remove(notificationId);
  }

  showNotification(notificationId: any) {
    this.navController.navigateForward([`/notifications/view/${notificationId}`]);
  }

  async getNotifications() {
    this.notificationsService.getNotifications().subscribe((res) => {
      this.notifications = res;
    });
  }

  async markAsRead() {
    this.notificationsService.markAsRead().subscribe((res) => {});
  }
}
