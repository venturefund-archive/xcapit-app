import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsStorageService } from '../shared-notifications/services/notifications-storage/notifications-storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notifications-list',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'notifications.notifications_list.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list
        *ngIf="this.notifications$ | async as notifications; else loading"
      >
        <app-notification-item
          *ngFor="let notification of notifications"
          [notification]="notification"
          (clickRemove)="this.removeNotification($event)"
          (clickNotification)="this.showNotification($event)"
        ></app-notification-item>
        <div *ngIf="!notifications.length">
          <ion-text>No hay notificaciones</ion-text>
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
  styleUrls: ['./notifications-list.page.scss']
})
export class NotificationsListPage implements OnInit {
  notifications$: Observable<any>;

  constructor(
    private notificationsStorage: NotificationsStorageService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.notifications$ = this.notificationsStorage.notifications;
  }

  removeNotification(notificationId: any) {
    this.notificationsStorage.remove(notificationId);
  }

  showNotification(notificationId: any) {
    this.navController.navigateForward([
      `/notifications/view/${notificationId}`
    ]);
  }
}
