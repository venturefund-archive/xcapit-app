import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-item-sliding>
      <ion-item button (click)="this.notificationClicked()">
        <ion-label>
          <h2>{{ this.notification | notification: 'title' }}</h2>
          <p>{{ this.notification | notification: 'body' }}</p>
        </ion-label>
        <ion-note slot="end" class="ion-text-center">
          {{ this.notification?.internalDate.toLocaleDateString() }}
          <br />
          {{ this.notification?.internalDate.toLocaleTimeString() }}
        </ion-note>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option color="danger" expandable (click)="this.remove()">
          <ion-icon slot="icon-only" name="trash"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent {
  @Input()
  notification: any;

  @Output()
  clickRemove = new EventEmitter<any>();

  @Output()
  clickNotification = new EventEmitter<any>();

  remove() {
    this.clickRemove.emit(this.notification.id);
  }

  notificationClicked() {
    this.clickNotification.emit(this.notification.id);
  }
}
