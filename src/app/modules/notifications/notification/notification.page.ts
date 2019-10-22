import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationsStorageService } from '../shared-notifications/services/notifications-storage/notifications-storage.service';

@Component({
  selector: 'app-notification',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            [defaultHref]="this.defaultBackRoute"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'notifications.notification.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-text>
        <h1>
          {{ this.notification | notification: 'title' }}
          <br />
          <ion-note slot="end" class="ion-text-center">
            {{ this.notification?.internalDate.toLocaleDateString() }}
            {{ this.notification?.internalDate.toLocaleTimeString() }}
          </ion-note>
        </h1>
        <p>{{ this.notification | notification: 'body' }}</p>
      </ion-text>
    </ion-content>
  `,
  styleUrls: ['./notification.page.scss']
})
export class NotificationPage implements OnInit {
  defaultBackRoute = '/notifications/list';
  notification: any;

  constructor(
    private route: ActivatedRoute,
    private notificationsStorage: NotificationsStorageService
  ) {}

  ngOnInit() {
    this.notification = this.notificationsStorage.get(
      parseInt(this.route.snapshot.paramMap.get('id'), 10)
    );
  }
}
