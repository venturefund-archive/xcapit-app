import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-notification-item',
  template: `
    <ion-item>
      <ion-label>
        <h2>
          <ion-skeleton-text animated style="width: 35%"></ion-skeleton-text>
        </h2>
        <p>
          <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  `,
  styleUrls: ['./skeleton-notification-item.component.scss']
})
export class SkeletonNotificationItemComponent {}
