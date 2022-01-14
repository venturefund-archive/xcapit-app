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
        <ion-title>{{ 'notifications.notifications_list.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list *ngIf="this.notifications">
        <app-notification-item
          *ngFor="let notification of notifications"
          [notification]="notification"
        ></app-notification-item>
        <div *ngIf="!notifications.length">
          <div class="container">
            <img src="assets/img/notifications/Notifications-logo.svg" alt="Notifications logo" />
          </div>
          <div class="title ux-font-text-lg">
            <ion-text>{{ 'notifications.notifications_list.title' | translate }}</ion-text>
          </div>
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
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.notifications$ = this.notificationsStorage.notifications;
    this.getNotifications();
  }

  ionViewWillLeave() {
    this.markAsRead();
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
